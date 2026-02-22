import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../../database/database.module';
import { pessoaProvider } from '../../modules/providers/pessoa.provider';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { SessionSerializer } from './serializers';
import { AccessTokenStrategy } from './strategies';
import { AuthStrategies } from './strategies/auth-strategies';

@Module({
  controllers: [AuthenticationController],

  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule.register({
      defaultStrategy: AuthStrategies.ACCESS_TOKEN,
    }),
  ],

  providers: [
    AuthenticationService,
    AccessTokenStrategy,
    SessionSerializer,
    ...pessoaProvider,
  ],

  exports: [
    SessionSerializer,
  ],
})
export class AuthenticationModule {}
