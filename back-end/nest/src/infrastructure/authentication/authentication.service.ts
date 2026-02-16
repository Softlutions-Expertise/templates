import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/base/entities/user.entity';

export interface ICurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<ICurrentUser | null> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      await this.userRepository.update(user.id, { lastLoginAt: new Date() });
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }

    return null;
  }

  async login(user: ICurrentUser) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async getCurrentUser(userId: string): Promise<ICurrentUser | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
