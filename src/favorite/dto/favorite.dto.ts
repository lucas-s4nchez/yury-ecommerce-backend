import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { ProductEntity } from "../../product/entities/product.entity";
import { IsProductExisting } from "../../cart/validators/existing-product.validator";

export class FavoriteDTO extends BaseDTO {
  @IsNotEmpty({ message: "El producto es requerido" })
  @IsProductExisting()
  product!: ProductEntity;
}
