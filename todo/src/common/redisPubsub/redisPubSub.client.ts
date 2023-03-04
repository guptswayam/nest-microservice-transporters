import { ClientProxy, ReadPacket, WritePacket } from "@nestjs/microservices";
// import {v4 as v4uuid} from "uuid"
import { RedisService } from "./redis.service";

export class RedisPubSubClient extends ClientProxy {

    responseCallbackHandlers: Map<string, (packet: WritePacket<any>) => void> = new Map()
    responseChannels: Map<string, boolean> = new Map()

    constructor(options: any) {
      super()

      console.log("OPTIONS:", options)
      this.initializeSerializer(options)
      this.initializeDeserializer(options)
      const redisSubClient = RedisService.getClient("sub")
      redisSubClient.on("message", async (channel, message) => {
        if (/.reply$/.test(channel)) {
          
          let parsedMessage = JSON.parse(message)
          parsedMessage = await this.deserializer.deserialize(parsedMessage)
          console.log("XYZ", parsedMessage)
          const handler = this.responseCallbackHandlers.get(parsedMessage.id)
          if(parsedMessage.isDisposed)
            this.responseCallbackHandlers.delete(parsedMessage.id)
          handler(parsedMessage)
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

      // const requestId = v4uuid()
      const { id: requestId} = this.assignPacketId(packet)
      packet = this.serializer.serialize(packet)

      if (!this.responseChannels.has(packet.pattern)) {
        const redisSubClient = RedisService.getClient("sub")
        redisSubClient.subscribe(`${packet.pattern}.reply`, (err, _) => {
          console.log(`Subscribed to a channel ${packet.pattern}.reply`);
          this.responseChannels.set(packet.pattern, true)
        })
      }

      this.responseCallbackHandlers.set(requestId, callback)
    
      const redisPubClient = RedisService.getClient("pub")
      redisPubClient.publish(packet.pattern, JSON.stringify(packet));

      
      return () => {
        // this function runs once the observable is completed or error occured in observable stream
        this.responseCallbackHandlers.delete(requestId)
        console.log("Teardown")
      }
    }
}