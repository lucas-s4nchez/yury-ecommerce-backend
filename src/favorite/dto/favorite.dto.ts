import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { ProductEntity } from "../../product/entities/product.entity";
import { IsProductExisting } from "../../cart/validators/existing-product.validator";
import { UserEntity } from "../../user/entities/user.entity";

export class FavoriteDTO extends BaseDTO {
  @IsNotEmpty({ message: "El usuario es requerido" })
  user!: UserEntity;

  @IsNotEmpty({ message: "El producto es requerido" })
  @IsProductExisting()
  product!: ProductEntity;
}
