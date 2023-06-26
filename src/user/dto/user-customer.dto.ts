import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";

export class UserCustomerDTO extends BaseDTO {
  @IsNotEmpty()
  province!: string;

  @IsNotEmpty()
  city!: string;

  @IsNotEmpty()
  address!: string;

  @IsNotEmpty()
  dni!: number;

  @IsNotEmpty()
  phone!: number;
}
