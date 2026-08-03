import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  databasePath: process.env.DATABASE_PATH || 'data/db.sqlite',
  databaseUrl: process.env.DATABASE_URL,
  databaseType: process.env.DATABASE_TYPE || 'better-sqlite3',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  port: parseInt(process.env.PORT || '3000', 10),
}));
