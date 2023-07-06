import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { UserEntity } from "../../user/entities/user.entity";

export class CartDTO extends BaseDTO {
  @IsNotEmpty({ message: "El usuario es requerido" })
  user!: UserEntity;
}
