import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseConfig } from './database/database.config';
import { AppController } from './app.controller';
import { AuthModule } from './apps/auth/auth.module';
import { CategoriesModule } from './apps/categories/categories.module';
import { ExpensesModule } from './apps/expenses/expenses.module';
import { DashboardModule } from './apps/dashboard/dashboard.module';
import { AuditoriaModule } from './apps/auditoria/auditoria.module';
import { ReportsModule } from './apps/reports/reports.module';

// ----------------------------------------------------------------------

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    AuthModule,
    CategoriesModule,
    ExpensesModule,
    DashboardModule,
    AuditoriaModule,
    ReportsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
