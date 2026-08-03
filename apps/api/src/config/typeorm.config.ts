import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbType = this.configService.get<string>('app.databaseType');
    if (dbType === 'postgres') {
      return {
        type: 'postgres',
        url: this.configService.get<string>('app.databaseUrl'),
        ssl: { rejectUnauthorized: false },
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      };
    }
    return {
      type: 'better-sqlite3',
      database: this.configService.get<string>('app.databasePath'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      invalidWhereValuesBehavior: {
        null: 'ignore',
      },
    };
  }
}
