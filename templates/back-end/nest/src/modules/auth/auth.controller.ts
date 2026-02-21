import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from '../../infrastructure';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { AuthService } from './auth.service';

const tryParseJson = (str: string) => {
  try {
    const parsed = JSON.parse(str);
    return parsed;
  } catch (error) {}
  return str;
};

@ApiTags('Autenticação')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiBearerAuth()
  @Get('/whoami')
  async getWhoAmI(@ResolveAcessoControl() acessoControl: AcessoControl) {
    return this.authService.getWhoAmI(acessoControl);
  }

  @Public()
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  @ApiParam({
    name: 'action',
    description: 'Ação a ser executada',
    required: true,
  })
  @Post('/check-can-perform/:action')
  async checkCanPerform(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('action') action: string,
    @Body() payload: any,
  ) {
    return this.authService.checkCanPerform(acessoControl, action, payload);
  }

  @Public()
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  @ApiParam({
    name: 'targetIdJson',
    description: 'ID do registro alvo',
    required: true,
  })
  @ApiParam({
    name: 'action',
    description: 'Ação a ser executada no alvo',
    required: true,
  })
  @Post('/check-can-reach/:targetIdJson/:action')
  async checkCanReachTarget(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('action') action: any,
    @Param('targetIdJson') targetIdJson: string,
    @Body() payload: any,
  ) {
    const targetId = tryParseJson(targetIdJson);

    return this.authService.checkCanReachTarget(
      acessoControl,
      action,
      targetId,
      payload,
    );
  }
}
