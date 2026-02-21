import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import eventBus from '../../../helpers/eventEmitter.helper';
import { AgendamentoEntity } from '../entities/agendamento.entity';

@Injectable()
export class AgendamentoEvent {
  constructor(
    @Inject('AGENDAMENTO_REPOSITORY')
    private repository: Repository<AgendamentoEntity>,
  ) {
    eventBus.on(
      'agendamento:finalizarAgendamento',
      async (cpfCrianca: string) => {
        this.finalizarAgendamento(cpfCrianca);
      },
    );
  }

  private async finalizarAgendamento(cpfCrianca: string): Promise<void> {
    const agendamentos = await this.findAgendamentosByCpfAndDate(cpfCrianca);

    if (agendamentos.length > 0) {
      for (const agendamento of agendamentos) {
        agendamento.status = 'finalizado';
        await this.repository.save(agendamento);
      }
    }
  }

  private async findAgendamentosByCpfAndDate(
    cpfCrianca: string,
  ): Promise<AgendamentoEntity[]> {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];
    const currentTimeString = currentDate
      .toTimeString()
      .split(' ')[0]
      .substring(0, 5);

    const agendamentos = await this.repository
      .createQueryBuilder('agendamento')
      .where('agendamento.cpf_crianca = :cpfCrianca', { cpfCrianca })
      .andWhere('DATE(agendamento.data) >= :currentDate', {
        currentDate: currentDateString,
      })
      .andWhere('agendamento.status != :status', { status: 'finalizado' })
      .getMany();

    return agendamentos;
  }
}
