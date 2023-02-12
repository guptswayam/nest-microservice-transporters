import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisPubSubClient } from 'src/common/redisPubsub/redisPubSub.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TODO_SERVICE',
        customClass: RedisPubSubClient,
        options: {    // these constructor will be passed to RedisPubSubClient contructor
          x: "YSD"    
        }
      }
    ]),
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
