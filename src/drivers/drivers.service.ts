import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    return this.prisma.driver.create({
      data: {
        name,
      },
    });
  }
}
