import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { V1Controller } from './v1-demo.controller';
import { validateEnv } from './config/env';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './storage/postgres/postgres.module';
import { DbInitController } from './storage/db-init.controller';
import { DocumentsModule } from './storage/documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PostgresModule,
    DocumentsModule,
  ],
  controllers: [AppController, V1Controller, DbInitController],
  providers: [AppService],
})
export class AppModule {}
