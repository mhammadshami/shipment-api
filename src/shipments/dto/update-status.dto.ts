import { ShipmentStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateStatusDto {
    @IsEnum(ShipmentStatus)
    status: ShipmentStatus
}