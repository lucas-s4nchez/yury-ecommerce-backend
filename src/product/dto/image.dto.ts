import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { ProductEntity } from "../entities/product.entity";

export class ImageDTO extends BaseDTO {
  @IsNotEmpty()
  url!: string;

  @IsNotEmpty()
  public_id!: string;

  @IsNotEmpty()
  product!: ProductEntity;
}
