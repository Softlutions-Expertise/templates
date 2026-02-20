import { Controller, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('/authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) { }

  @Get('oidc/main/.well-known/openid-configuration')
  getOpenIdConfiguration() {
    return this.authenticationService.getOpenIdConfiguration();
  }
}
