import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { getJwtSecret } from './constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles =
      this.reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (roles.includes('public')) {
      return true;
    }

    const request = GqlExecutionContext.create(context).getContext()?.req;
    const authorization = request?.headers?.authorization;

    if (
      typeof authorization !== 'string' ||
      !authorization.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException();
    }

    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.jwtService
      .verifyAsync(token, { secret: getJwtSecret() })
      .catch(() => {
        throw new UnauthorizedException();
      });

    if (roles.length > 0 && !roles.includes(payload.role)) {
      throw new UnauthorizedException();
    }

    request.user = payload;
    return true;
  }
}
