import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { timingSafeEqual } from 'crypto';
import { Users, UsersDocument } from './schemas/users.schema';
import {
  IJwtPayload,
  ILoginResponse,
} from './interfaces/auth-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Users | null> {
    const user = await this.userModel.findOne({ username }).exec();
    if (user && this.comparePasswords(user.password, password)) {
      return user;
    }
    return null;
  }

  async login(user: Users): Promise<ILoginResponse> {
    const payload: IJwtPayload = {
      user: user.name,
      sub: user.userId,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private comparePasswords(
    storedPassword: string,
    suppliedPassword: string,
  ): boolean {
    const stored = Buffer.from(storedPassword);
    const supplied = Buffer.from(suppliedPassword);

    if (stored.length !== supplied.length) {
      return false;
    }

    return timingSafeEqual(stored, supplied);
  }
}
