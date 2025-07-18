import { PrismaService } from './../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [DriversController],
  providers: [DriversService]
})
export class DriversModule {
  constructor(private prisma: PrismaService) {}

  async create() {
    
  }
}
