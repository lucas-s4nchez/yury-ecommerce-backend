import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { UserEntity } from "../../user/entities/user.entity";

export class OrderDTO extends BaseDTO {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  province!: string;

  @IsNotEmpty()
  city!: string;

  @IsNotEmpty()
  address!: string;

  @IsNotEmpty()
  dni!: number;

  @IsNotEmpty()
  phone!: string;

  @IsNotEmpty()
  total!: number;

  @IsNotEmpty()
  user!: UserEntity;

  @IsNotEmpty()
  totalItems!: number;

  @IsOptional()
  isPaid!: boolean;

  @IsOptional()
  status!: OrderStatusType;
}

export enum OrderStatusType {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}
