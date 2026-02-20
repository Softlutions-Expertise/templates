import { Injectable } from '@nestjs/common';
import { DatabaseContextService } from './infrastructure/database-context/database-context.service';

@Injectable()
export class AppService {
  constructor(private databaseContextService: DatabaseContextService) {}

  private async getDbStats() {
    return this.databaseContextService.getDbStats().catch(() => 'err');
  }

  private getClockContainerStats() {
    const now = new Date();

    return {
      iso: now.toISOString(),
      utc: now.toUTCString(),
      locale: now.toString(),
    };
  }

  private async getClock() {
    return {
      container: this.getClockContainerStats(),
      db: await this.getDbStats(),
    };
  }

  async env() {
    return {
      ...this.index(),

      clock: await this.getClock(),
    };
  }

  index() {
    return {
      status: 'up',
      service: 'ms_fila_espera ' + process.env.VERSION,
    };
  }

  // show timezone;
}
