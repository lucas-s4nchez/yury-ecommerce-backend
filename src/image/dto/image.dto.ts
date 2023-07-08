import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { IsProductExisting } from "../../cart/validators/existing-product.validator";
import { IsMaxImagesPerProduct } from "../validators/max-image.validator";
import { ProductEntity } from "../../product/entities/product.entity";

export class ImageDTO extends BaseDTO {
  @IsNotEmpty({ message: "La url es requerida" })
  url!: string;

  @IsNotEmpty({ message: "El id público es requerido" })
  public_id!: string;

  @IsNotEmpty({ message: "El producto es requerido" })
  @IsProductExisting()
  @IsMaxImagesPerProduct()
  product!: ProductEntity;
}
