import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../config/typeorm.config';
import appConfig from '../config/app.config';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { ProjectsModule } from './projects.module';
import { PagesModule } from './pages.module';
import { SectionsModule } from './sections.module';
import { RevisionsModule } from './revisions.module';
import { SeedModule } from './seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    PagesModule,
    SectionsModule,
    RevisionsModule,
    SeedModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
        }),
    },
  ],
})
export class AppModule {}
