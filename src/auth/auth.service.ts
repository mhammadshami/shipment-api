import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException('Invalid credentials');

    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersService.updateRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }
  async register(registerDto: RegisterDto) {
    const { email, password, role } = registerDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new ConflictException('Email already exists');

    return this.usersService.createUser(email, password, role);
  }

  async validateRefreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(payload.email);
      if (user && user.refreshToken === token) return user;

      return null;
    } catch (err) {
      return null;
    }
  }
}
