import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { ProductEntity } from "../../product/entities/product.entity";

export class ImageDTO extends BaseDTO {
  @IsNotEmpty({ message: "La url es requerida" })
  url!: string;

  @IsNotEmpty({ message: "El id público es requerido" })
  public_id!: string;

  @IsNotEmpty({ message: "El producto es requerido" })
  product!: ProductEntity;
}
