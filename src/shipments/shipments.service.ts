import { AssignDriverDto } from './dto/assign-driver.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShipmentStatus } from '@prisma/client';

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService) {}

  async createShipment(createShipmentDto: CreateShipmentDto) {
    return this.prisma.shipment.create({
      data: createShipmentDto,
    });
  }

  async createWithInvoice(dto: CreateShipmentDto) {
    return this.prisma.$transaction(async (prisma) => {
      const shipment = await prisma.shipment.create({
        data: {
          title: dto.title,
          status: dto.status,
          clientId: dto.clientId,
        },
      });

      await prisma.invoice.create({
        data: {
          shipmentId: shipment.id,
          amount: this.calculateInvoiceAmount(dto),
        },
      });

      return shipment;
    });
  }

  private calculateInvoiceAmount(dto: CreateShipmentDto) {
    return 100.0;
  }

  async findAll() {
    return this.prisma.shipment.findMany({
      include: {
        client: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.shipment.delete({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateShipmentDto: UpdateShipmentDto) {
    return this.prisma.shipment.update({
      where: { id },
      data: updateShipmentDto,
      include: {
        client: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.shipment.findUnique({
      where: { id },
      include: { client: true, route: true, tracking: true },
    });
  }

  async assignDriver(dto: AssignDriverDto) {
    const existingDriver = await this.prisma.driver.findUnique({
      where: {
        id: dto.driverId,
      },
    });
    if (!existingDriver) throw new NotFoundException('Driver not found');

    return this.prisma.driverOnShipment.create({
      data: {
        driverId: dto.driverId,
        shipmentId: dto.shipmentId,
      },
    });
  }

  async findForDriver(driverId: number) {
    return this.prisma.driverOnShipment.findMany({
      where: { driverId },
      include: {
        shipment: true,
      },
    });
  }

  async updateStatus(shipmentId: number, status: ShipmentStatus) {
    return this.prisma.$transaction(async (prisma) => {
      const updatedShipment = await this.prisma.shipment.update({
        where: { id: shipmentId },
        data: {
          status,
        },
      });

      await this.prisma.trackingUpdate.create({
        data: {
          shipmentId,
          status,
        },
      });

      return updatedShipment;
    });
  }

  async getTrackingUpdate(shipmentId: number) {
    return this.prisma.trackingUpdate.findMany({
      where: { shipmentId },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getInvoice(id: number) {
    return this.prisma.invoice.findUnique({
      where: {
        id,
      },
    });
  }

  async getTotalShipments() {
    return this.prisma.shipment.count();
  }

  async getShipmentByStatus(status: ShipmentStatus) {
    return this.prisma.shipment.groupBy({
      by: ['status'],
      _count: { status: true },
    });
  }

  async getTotalRevenue() {
    const result = await this.prisma.invoice.aggregate({
      _sum: { amount: true },
    });

    return {totalRevenue: result._sum || 0}
  }
}
