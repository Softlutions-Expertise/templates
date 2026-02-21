import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';

export interface FilaJobData {
  idSecretaria: string;
  idEscola: string;
  idEtapa: number;
  turno: string;
  anoLetivo: string;
}

@Injectable()
export class FilaQueueService {
  constructor(
    @InjectQueue('fila-generation')
    private filaQueue: Queue<FilaJobData>,
  ) {}

  async addFilaGenerationJob(data: FilaJobData): Promise<void> {
    const jobId = this.getJobId(data);
    
    console.log(`FilaQueueService#addFilaGenerationJob: Adding job with ID: ${jobId} for data:`, data);
    
    await this.filaQueue.add('generate-fila', data, {
      jobId,
      removeOnComplete: 5,
      removeOnFail: 10,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
    
    console.log(`FilaQueueService#addFilaGenerationJob: Job added successfully with ID: ${jobId}`);
  }

  private getJobId(data: FilaJobData): string {
    const baseJobId = `fila-${data.idSecretaria}-${data.idEscola}-${data.idEtapa}-${data.turno}-${data.anoLetivo}`;
    const jobId = `${uuidv4()}-${baseJobId}`;
    console.log(`FilaQueueService#getJobId: Generated job ID: ${jobId}`);
    return jobId;
  }
}
