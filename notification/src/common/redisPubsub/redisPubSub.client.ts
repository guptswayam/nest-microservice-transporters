import { ClientProxy, ReadPacket, WritePacket } from "@nestjs/microservices";
import {v4 as v4uuid} from "uuid"
import { RedisService } from "./redis.service";

export class RedisPubSubClient extends ClientProxy {

    responseCallbackHandlers: Map<string, (packet: WritePacket<any>) => void> = new Map()
    responseChannels: Map<string, boolean> = new Map()

    constructor() {
      super()

      const redisSubClient = RedisService.getClient("sub")
      redisSubClient.on("message", (channel, message) => {
        if (/.reply$/.test(channel)) {
          
          const parsedMessage = JSON.parse(message)
          console.log("XYZ", parsedMessage)
          const handler = this.responseCallbackHandlers.get(parsedMessage.id)
          handler({response: parsedMessage.data})
        }
      })

    }

    async connect(): Promise<any> {}
  
    async close() {
      console.log('close');
    }
  
    async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
      console.log('event to dispatch: ', packet);
      const redisPubClient = RedisService.getClient("pub")
      redisPubClient.publish(packet.pattern, JSON.stringify(packet.data));
    }

    publish(
      packet: ReadPacket<any>,
      callback: (packet: WritePacket<any>) => void,
    ): () => void {

      const requestId = v4uuid()

      if (!this.responseChannels.has(packet.pattern)) {
        const redisSubClient = RedisService.getClient("sub")
        redisSubClient.subscribe(`${packet.pattern}.reply`, (err, _) => {
          console.log(`Subscribed to a channel ${packet.pattern}.reply`);
          this.responseChannels.set(packet.pattern, true)
        })
      }

      this.responseCallbackHandlers.set(requestId, callback)
    
      const redisPubClient = RedisService.getClient("pub")
      redisPubClient.publish(packet.pattern, JSON.stringify({
        pattern: packet.pattern,
        data: packet.data,
        id: requestId
      }));

      
      return () => {}
    }
}