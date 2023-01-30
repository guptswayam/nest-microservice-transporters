import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import {RedisService} from './redis.service';

export class RedisPubSubServer
  extends Server
  implements CustomTransportStrategy {
  /**
   * This method is triggered when you run "app.listen()".
   */


    listen(callback: () => void) {

        const redisSubClient = RedisService.getClient("sub")
        const redisPubClient = RedisService.getClient("pub")

        // console.log(this.messageHandlers.get("todos_findall").isEventHandler)
        
        for (const key of this.messageHandlers.keys()) {
            redisSubClient.subscribe(key, (err, count) => {
                if (err) console.error(err.message);
                console.log(`Subscribed to a channel ${key}`);
            });

            // if(!this.messageHandlers.get(key).isEventHandler) {
            //     redisSubClient.subscribe(`${key}.reply`, () => {
            //         console.log(`Subscribed to a channel ${key}.reply`);
            //     })
            // }
        }

        redisSubClient.on("message", async (channel, message) => {
            if (this.messageHandlers.has(channel)) {
                const handler = this.messageHandlers.get(channel)
                const resData = await (handler(JSON.parse(message)) as Promise<any>)
                if(!handler.isEventHandler) {
                    redisPubClient.publish(`${channel}.reply`, JSON.stringify(resData))
                }
            }
                
        });

        callback();
    }

    /**
     * This method is triggered on application shutdown.
     */
    close() {
        
    }
}