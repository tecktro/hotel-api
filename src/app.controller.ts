import { Request, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Users } from './auth/schemas/users.schema';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: { user: Users }) {
    return this.authService.login(req.user);
  }
}
