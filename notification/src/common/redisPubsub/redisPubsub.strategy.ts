import { CustomTransportStrategy, Server, Transport, IncomingRequest } from '@nestjs/microservices';
import { tap } from 'rxjs';
import {RedisService} from './redis.service';

export class RedisPubSubServer
  extends Server
  implements CustomTransportStrategy {


    // To use multiple strategies, we could define transportId in custom strategy and then nest will take of separation of listeners by just passing transportId in message pattern decorator
    transportId?: symbol | Transport;

    constructor(transportId: symbol) {
        super()
        this.transportId = transportId
    }


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
                const msg = JSON.parse(message) as IncomingRequest;
                const resData = await (handler(msg.data) as Promise<any>)
                if(!handler.isEventHandler) {
                    const response = this.transformToObservable(resData).pipe(tap(x => x))
                    this.send(response, (res) => {
                        const resData = Object.assign({}, msg, res)
                        delete resData.data // this is received data
                        redisPubClient.publish(`${channel}.reply`, JSON.stringify(resData))
                    })
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