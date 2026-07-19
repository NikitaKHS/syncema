import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthController, AuthGuard, AuthService } from './auth.js';
import { RoomsGateway } from './gateway.js';
import { MessagesController, RoomsController } from './rooms.js';
import { StoreService } from './store.service.js';
import { DevicesController, SystemController, YouTubeController } from './system.js';

@Module({
  imports: [JwtModule.register({}), ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }])],
  controllers: [AuthController, RoomsController, MessagesController, SystemController, YouTubeController, DevicesController],
  providers: [StoreService, AuthService, AuthGuard, RoomsGateway, { provide: APP_GUARD, useClass: ThrottlerGuard }]
})
export class AppModule {}
