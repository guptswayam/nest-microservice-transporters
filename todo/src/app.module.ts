import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { CommonModule } from './common/common.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [TodosModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
