/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as socketIo from 'socket.io'

import { AppModule } from './app/app.module';
import initDB from './app/services/repository/db/init'
import {initializeListeners} from "./app/socket";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  try {
    await initDB.initHandler()
    // await fixtures()
  } catch (e) {
    console.log(e)
  }
  app.enableCors() // TODO on development toggle
  const server = app.getHttpServer()
  const socketServer = new socketIo.Server(server, {
    cors: {
      origin: ['http://localhost:4200'],
      credentials: true,
    },
  })
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
);

  socketServer.on('connection', (socket) => {
    initializeListeners(socket)
  })
}

bootstrap();
