import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';

describe('AppController', () => {
  let appController: AppController;
  let authService: { login: jest.Mock };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('delegates login to AuthService', async () => {
    const user = { userId: '1', name: 'Miguel', role: 'manager' };
    authService.login.mockResolvedValue({ access_token: 'token' });

    await expect(appController.login({ user } as any)).resolves.toEqual({
      access_token: 'token',
    });
    expect(authService.login).toHaveBeenCalledWith(user);
  });
});
