import { DriversService } from './drivers.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  async create(@Body('name') name: string){
    return this.driversService.create(name);
  }
}
