import { Injectable } from '@nestjs/common';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

@Injectable()
export class AuthorizationService {
  private roleHierarchy: Record<Role, number> = {
    [Role.ADMIN]: 3,
    [Role.MODERATOR]: 2,
    [Role.USER]: 1,
  };

  hasRole(userRole: Role, requiredRole: Role): boolean {
    return this.roleHierarchy[userRole] >= this.roleHierarchy[requiredRole];
  }

  hasAnyRole(userRole: Role, requiredRoles: Role[]): boolean {
    return requiredRoles.some((role) => this.hasRole(userRole, role));
  }
}
