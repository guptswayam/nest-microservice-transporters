import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RedisPubSubServer } from './common/redisPubsub/redisPubsub.strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Then combine it with your microservice
  // const microservice = app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.REDIS,
  //   options: { host: 'localhost', port: 6379, },
  // });

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    strategy: new RedisPubSubServer(),
  })

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
