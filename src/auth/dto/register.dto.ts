import { Role } from "@prisma/client";
import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    password: string

    @IsOptional()
    @IsEnum(Role)
    role: Role;
}