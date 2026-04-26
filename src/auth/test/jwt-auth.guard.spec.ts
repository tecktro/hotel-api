import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: { verifyAsync: jest.Mock };
  let reflector: { getAllAndOverride: jest.Mock };

  const createContext = (authorization?: string) => {
    const request: Record<string, any> = {
      headers: {},
    };

    if (authorization) {
      request.headers.authorization = authorization;
    }

    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getType: jest.fn().mockReturnValue('graphql'),
      getArgs: jest.fn().mockReturnValue([{}, {}, { req: request }, {}]),
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    };
    reflector = {
      getAllAndOverride: jest.fn(),
    };
    guard = new JwtAuthGuard(
      jwtService as any,
      reflector as unknown as Reflector,
    );
  });

  it('allows public resolvers without a token', async () => {
    reflector.getAllAndOverride.mockReturnValue(['public']);

    await expect(guard.canActivate(createContext())).resolves.toBe(true);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('rejects requests without a bearer token', async () => {
    reflector.getAllAndOverride.mockReturnValue(['manager']);

    await expect(guard.canActivate(createContext())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects users without the required role', async () => {
    reflector.getAllAndOverride.mockReturnValue(['manager']);
    jwtService.verifyAsync.mockResolvedValue({ role: 'guest' });

    await expect(
      guard.canActivate(createContext('Bearer signed-token')),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('accepts a valid token with a matching role', async () => {
    reflector.getAllAndOverride.mockReturnValue(['manager']);
    jwtService.verifyAsync.mockResolvedValue({ role: 'manager' });

    await expect(
      guard.canActivate(createContext('Bearer signed-token')),
    ).resolves.toBe(true);
  });
});
