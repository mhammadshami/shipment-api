import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    email: string,
    password: string,
    role: Role = Role.CLIENT,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken,
      },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
