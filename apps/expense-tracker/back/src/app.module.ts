import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseConfig } from './database/database.config';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { ReportsModule } from './modules/reports/reports.module';

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
