import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function handleDatabaseError(error: any): never {
  // Postgres unique violation
  if (error.code === '23505') {
    throw new ConflictException('Resource already exists');
  }

  // Postgres foreign key violation
  if (error.code === '23503') {
    throw new BadRequestException('Related resource not found');
  }

  // Postgres check violation
  if (error.code === '23514') {
    throw new BadRequestException('Invalid data provided');
  }

  // Postgres not null violation
  if (error.code === '23502') {
    throw new BadRequestException('Required field is missing');
  }

  throw new InternalServerErrorException('An unexpected error occurred');
}

export function throwIfNotFound<T>(
  entity: T | null | undefined,
  message = 'Resource not found',
): asserts entity is T {
  if (!entity) {
    throw new NotFoundException(message);
  }
}
