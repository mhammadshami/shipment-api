import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Roles('ADMIN')
  @Post()
  async create(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentsService.createShipment(createShipmentDto);
  }

  @Roles('ADMIN')
  @Post('with-invoice')
  async createWithInvoice(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentsService.createWithInvoice(createShipmentDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentsService.remove(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShipmentDto: UpdateShipmentDto,
  ) {
    return this.shipmentsService.update(id, updateShipmentDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentsService.findOne(id);
  }

  @Roles('ADMIN')
  @Post('assign-driver')
  async assignDriver(@Body() dto: AssignDriverDto) {
    return this.shipmentsService.assignDriver(dto);
  }

  @Roles('DRIVER')
  @Get('my-shipments')
  async getMyShipments(@Request() req) {
    return this.shipmentsService.findForDriver(req.user.userId);
  }

  @Roles('ADMIN', 'MANAGER')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.shipmentsService.updateStatus(id, dto.status);
  }

  @Get(':id/tracking')
  async getTracking(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.shipmentsService.getTrackingUpdate(id);
  }

  @Get(':id/invoice')
  async getInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentsService.getInvoice(id);
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('dashboard/total-shipments')
  async getTotalShipments() {
    return this.shipmentsService.getTotalShipments();
  }

  @Roles('ADMIN')
  @Get('dashboard/total-revenue')
  async getTotalRevenue() {
    return this.shipmentsService.getTotalRevenue()
  }
}
 