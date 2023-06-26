import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseDTO } from "../../config/base.dto";

export class UserDTO extends BaseDTO {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsOptional()
  role!: RoleType;
}

export enum RoleType {
  USER = "USER",
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}
