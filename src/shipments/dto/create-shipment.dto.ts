import { ShipmentStatus } from "@prisma/client";
import { IsEnum, IsInt, IsString } from "class-validator";

export class CreateShipmentDto {
    @IsString()
    title: string;

    @IsEnum(ShipmentStatus)
    status: ShipmentStatus;

    @IsInt()
    clientId: number;
}