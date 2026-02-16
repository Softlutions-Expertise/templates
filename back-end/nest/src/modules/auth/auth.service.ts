import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../base/entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
  ) {}

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    // Save token
    const passwordReset = this.passwordResetRepository.create({
      userId: user.id,
      token,
      expiresAt,
    });

    await this.passwordResetRepository.save(passwordReset);

    // TODO: Send email with reset link
    // For now, just log the token (in production, send via email)
    console.log(`Password reset token for ${email}: ${token}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const passwordReset = await this.passwordResetRepository.findOne({
      where: {
        token,
        usedAt: null,
        expiresAt: new Date(),
      },
    });

    if (!passwordReset) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Check if expired
    if (new Date() > passwordReset.expiresAt) {
      throw new BadRequestException('Token has expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await this.userRepository.update(passwordReset.userId, {
      password: hashedPassword,
    });

    // Mark token as used
    await this.passwordResetRepository.update(passwordReset.id, {
      usedAt: new Date(),
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.passwordResetRepository.delete({
      expiresAt: LessThan(new Date()),
      usedAt: null,
    });
  }
}
