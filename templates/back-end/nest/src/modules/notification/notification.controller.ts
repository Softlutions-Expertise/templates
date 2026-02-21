import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetDoc } from '../../helpers/decorators/swagger.decorator';
import { Roles } from '../../helpers/enums/role.enum';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { NotificationService } from './notification.service';

@ApiTags('Notificações')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @GetDoc(
    'Notificações',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    ['unidadeEscolarId', 'secretariaMunicipalId', 'lastDateViewed'],
  )
  async getNotification(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Query() query: any,
  ): Promise<any> {
    return await this.notificationService.getNotifications(
      acessoControl,
      query,
    );
  }
}
