import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { ProductEntity } from "../../product/entities/product.entity";
import { IsProductUnique } from "../validators/product-unique.validator";
import { IsProductExisting } from "../../cart/validators/existing-product.validator";

export class StockDTO extends BaseDTO {
  @IsNotEmpty({ message: "La cantidad es requerida" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "La cantidad debe ser un valor numérico" }
  )
  @Min(0, { message: "La cantidad debe ser mayor o igual a 0" })
  quantity!: number;

  @IsNotEmpty({ message: "El producto es requerido" })
  @IsProductExisting()
  @IsProductUnique()
  product!: ProductEntity;
}
export class UpdateStockDTO extends BaseDTO {
  @IsNotEmpty({ message: "La cantidad es requerida" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "La cantidad debe ser un valor numérico" }
  )
  @Min(0, { message: "La cantidad debe ser mayor o igual a 0" })
  quantity!: number;
}
