import { Controller, Get, Post, Body, Patch, Param, Delete, OnApplicationBootstrap } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { promisify } from 'util';
import { RedisPubSubServer } from 'src/common/redisPubsub/redisPubsub.strategy';
import strategiesConstant from 'src/strategies.constant';

const sleep = promisify(setTimeout)

const AllowedRequests = {
  todos_findall: "handleTodoFindAll"
}

@Controller('todos')
export class TodosController {
  serverStrategy: RedisPubSubServer

  constructor(private readonly todosService: TodosService) {
    // Another way of instantiating strategy and adding message pattern handlers.
    this.serverStrategy = new RedisPubSubServer(strategiesConstant.symbols.TODO)   
    for(const key in AllowedRequests) {
      if(AllowedRequests[key] && this[AllowedRequests[key]]) {
        this.serverStrategy.addHandler(key, this.handleTodoFindAll, false, {})
      }
    }
    this.serverStrategy.listen(() => {
      console.log("Message Patterns are Registered and strategy is ready to serve requests")
    })
  }
  

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(+id);
  }

  // @EventPattern('todos_get')
  // async handleGetTODO(data: Record<string, unknown>) {
  //   console.log(data)
  // }

  // @EventPattern('todos_create')
  // async handleCreateTODO(data: Record<string, unknown>) {
  //   console.log(data)
  // }

  // @MessagePattern("todos_findall", strategiesConstant.symbols.TODO)
  // async handleTodoFindAll(data: Record<string, unknown>) {
  //   await sleep(1000)
  //   return data
  // }

  async handleTodoFindAll(data: Record<string, unknown>) {
    await sleep(1000)
    return data
  }

  @MessagePattern("todos_findone", strategiesConstant.symbols.TODO)
  async handleTodoFindOne(data: Record<string, unknown>) {
    await sleep(1000)
    return data
  }
}
