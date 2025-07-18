import { ShipmentStatus } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateShipmentDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsOptional()
    @IsEnum(ShipmentStatus)
    status?: ShipmentStatus;
}