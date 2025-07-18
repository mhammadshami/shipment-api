import { isInt, IsInt } from "class-validator";

export class AssignDriverDto {
    @IsInt()
    shipmentId: number;

    @IsInt()
    driverId: number;
}