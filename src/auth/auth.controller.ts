import { UsersService } from './../users/users.service';
import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // @Post('refresh')
  // async refresh(@Body('refresh_token') token: string) {
  //   const user = await this.authService.validateRefreshToken(token);
  //   if (!user) throw new UnauthorizedException('Invalid refresh token');

  //   return this.authService.login(user.email, await bcrypt. user.);
  // }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() req) {
    await this.usersService.updateRefreshToken(req.user.userId, null);
    return { message: "Logged out successfully"}
  }
}
