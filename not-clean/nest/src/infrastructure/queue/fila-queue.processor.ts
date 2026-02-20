import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Injectable, Inject } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { FilaJobData } from './fila-queue.service';

@Processor('fila-generation')
@Injectable()
export class FilaQueueProcessor {
  constructor(
    @Inject('FilaService') private readonly filaService: any,
    @InjectQueue('fila-generation') private readonly queue: Queue<FilaJobData>,
  ) {
    console.log('🚀 FilaQueueProcessor instantiated and ready to process jobs');
    console.log('🔍 Queue instance:', this.queue.name);
  }

  @Process('generate-fila')
  async handleFilaGeneration(job: Job<FilaJobData>) {
    console.log(`🔄 Processing fila generation job: ${job.id} - ${JSON.stringify(job.data)}`);
    
    try {
      const result = await this.filaService.createCore(
        job.data.idSecretaria,
        job.data.idEscola,
        job.data.idEtapa,
        job.data.turno,
        job.data.anoLetivo,
      );
      
      console.log(`✅ Fila generation completed for job: ${job.id}`);
      return result;
    } catch (error) {
      console.error(`❌ Error processing fila generation job ${job.id}:`, error);
      throw error;
    }
  }
}
