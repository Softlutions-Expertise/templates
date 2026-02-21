import { UnauthorizedException } from '@nestjs/common';

export class AccessTokenExpiredException extends UnauthorizedException {
  constructor() {
    super('The provided access token is either invalid or expired.');
  }
}
