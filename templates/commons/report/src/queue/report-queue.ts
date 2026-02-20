import Queue from 'bull';

// ----------------------------------------------------------------------

export interface ReportJob {
  templateName: string;
  data: any;
  userId: string;
  outputType: 'pdf' | 'html' | 'url';
}

// ----------------------------------------------------------------------

export class ReportQueue {
  private queue: Queue.Queue<ReportJob>;

  constructor(redisUrl: string = 'redis://localhost:6379') {
    this.queue = new Queue<ReportJob>('report-generation', redisUrl);
  }

  async addJob(job: ReportJob): Promise<Queue.Job<ReportJob>> {
    return this.queue.add(job, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async getJobStatus(jobId: string) {
    const job = await this.queue.getJob(jobId);
    if (!job) return null;
    
    return {
      id: job.id,
      state: await job.getState(),
      progress: job.progress(),
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }

  process(processor: (job: Queue.Job<ReportJob>) => Promise<any>) {
    this.queue.process(processor);
  }

  async close() {
    await this.queue.close();
  }
}
