import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisPubSubClient } from 'src/common/redisPubsub/redisPubSub.client';

class Serializer {
  serialize(msg) {
    msg.timestamp = Date.now()
    return msg
  }
}

class Deserializer {
  deserialize(msg) {
    delete msg.response.timestamp
    return msg
  }
}

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'TODO_SERVICE',
    //     customClass: RedisPubSubClient,
    //     options: {    // these constructor will be passed to RedisPubSubClient contructor
    //       x: "YSD"    
    //     }
    //   }
    // ]),
  ],
  controllers: [TodosController],
  providers: [TodosService, 
    {
      provide: "TODO_SERVICE",
      useFactory: () => {
        return new RedisPubSubClient({
          x: "YSD",
          serializer: new Serializer(),
          deserializer: new Deserializer(),
        })
      },
    }
  ],
})
export class TodosModule {}
