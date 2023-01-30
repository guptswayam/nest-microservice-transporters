import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { MessagePattern } from '@nestjs/microservices';
import { promisify } from 'util';
import { Observable, of } from 'rxjs';

const sleep = promisify(setTimeout)

let COUNT = 0

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }

  // REDIS ONE
  @MessagePattern("pools_findall")
  handlePoolFindAll(data: Record<string, unknown>) {
    console.log("DATA: ", data)
    // await sleep(1000)
    return data
    // return of(data)
  }

  // REDIS ONE With Observables
  @MessagePattern("pools_findone")
  async handlePoolFindOne(data: Record<string, unknown>) {
    console.log("DATA:", data)
    return new Observable((subscriber) => {
      (async function() {
        await sleep(200)
        subscriber.next(data)
        await sleep(200)
        subscriber.next({
          seth: "rollins",
        })

        subscriber.complete()
      })()
    })
  }
  
  // CUSTOM ONE
  @MessagePattern("todos_findall")
  async handleTodoFindAll(data: Record<string, unknown>) {
    console.log("DATA:", data)
    await sleep(1000)
    return data
  }

  // CUSTOM ONE
  @MessagePattern("todos_findone")
  async handleTodoFindOne(data: Record<string, unknown>) {
    console.log("DATA:", data)
    await sleep(1000)
    return data
  }

}
