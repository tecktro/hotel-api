import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { Users } from '../schemas/users.schema';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: { sign: jest.Mock };
  let userModel: { findOne: jest.Mock };

  beforeEach(async () => {
    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };
    userModel = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: getModelToken(Users.name),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('returns the user when credentials match', async () => {
    const user = { username: 'miguel', password: 'secret' };
    userModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(user),
    });

    await expect(service.validateUser('miguel', 'secret')).resolves.toEqual(
      user,
    );
  });

  it('returns null when credentials do not match', async () => {
    userModel.findOne.mockReturnValue({
      exec: jest
        .fn()
        .mockResolvedValue({ username: 'miguel', password: 'secret' }),
    });

    await expect(service.validateUser('miguel', 'wrong')).resolves.toBeNull();
  });

  it('signs a JWT payload on login', async () => {
    const user = {
      userId: '42',
      name: 'Miguel',
      role: 'manager',
    } as Users;

    await expect(service.login(user)).resolves.toEqual({
      access_token: 'signed-token',
    });
    expect(jwtService.sign).toHaveBeenCalledWith({
      role: 'manager',
      sub: '42',
      user: 'Miguel',
    });
  });
});
