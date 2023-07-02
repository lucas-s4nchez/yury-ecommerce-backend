import { IsNotEmpty, IsNumber, Validate } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { ProductEntity } from "../../product/entities/product.entity";
import { IsProductUnique } from "../validators/product-unique.validator";

export class StockDTO extends BaseDTO {
  @IsNotEmpty({ message: "La cantidad es requerida" })
  @IsNumber(
    { allowNaN: false },
    { message: "La cantidad debe ser un valor numérico" }
  )
  @Validate((value: number) => value > 0, {
    message: "La cantidad debe ser un número mayor a 0",
  })
  quantity!: number;

  @IsNotEmpty({ message: "El producto es requerido" })
  @IsProductUnique()
  product!: ProductEntity;
}
export class UpdateStockDTO extends BaseDTO {
  @IsNotEmpty({ message: "La cantidad es requerida" })
  @IsNumber({ allowNaN: false }, { message: "Tipo de dato incorrecto" })
  @Validate((value: number) => value > 0, {
    message: "La cantidad debe ser un número mayor a 0",
  })
  quantity!: number;
}
