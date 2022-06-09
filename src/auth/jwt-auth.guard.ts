import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext().req;
    const token = ctx.headers.authorization.replace('Bearer ', '');
    const payload = await this.jwtService
      .verifyAsync(token, { secret: jwtConstants.secret })
      .catch(() => {
        throw new UnauthorizedException();
      });

    const roles = Reflect.getMetadata('roles', context.getHandler());
    if (payload.role !== roles[0]) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
