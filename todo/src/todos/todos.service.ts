import { HttpException, HttpStatus, Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { RedisPubSubClient } from 'src/common/redisPubsub/redisPubSub.client';
import { promisify } from 'util';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

const sleep = promisify(setTimeout)

@Injectable()
export class TodosService implements OnApplicationBootstrap {
  // client: ClientProxy
  // client: RedisPubSubClient;

  constructor(@Inject("TODO_SERVICE") private client: RedisPubSubClient) {
    // this.client = new RedisPubSubClient()
  }

  counter: number = 1

  // constructor(@Inject("TODO_SERVICE") private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  create(createTodoDto: CreateTodoDto) {
    this.client.emit("todos_create", {title: "first-todo"})
    return 'This action adds a new todo';
  }

  async findAll() {
    // this.client.emit("todos_get", {x: "y"})
    try {
      let resData;
      const res = await new Promise((resolve, reject) => {
        this.client.send("todos_findall", {counter: this.counter++}).pipe(
          timeout(2000)
        ).subscribe({
          next: (data) => {
            console.log("FINDALL", data)
            resData = data
          },
          complete: () => {
            resolve(resData)
          },
          error: (err) => {
            reject(err)
          }
        })
      })

      return res
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)   
    }
  }

  findOne(id: number) {
    return lastValueFrom(this.client.send("todos_findone", {dean: "ambrose"}))
    // return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
