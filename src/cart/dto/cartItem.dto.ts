import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { ProductEntity } from "../../product/entities/product.entity";
import { CartEntity } from "../entities/cart.entity";
import { SizeEntity } from "../../size/entities/size.entity";
import { IsProductExisting } from "../validators/existing-product.validator";
import { IsSizeRelatedToProduct } from "../validators/size-related-to-product.validator";
import { IsCartExisting } from "../validators/existing-cart.validator";

export class CartItemDTO extends BaseDTO {
  @IsNotEmpty({ message: "La cantidad es requerida" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "La cantidad debe ser un número" }
  )
  @Min(1, { message: "La cantidad mínima es de 1 unidad" })
  quantity!: number;

  @IsNotEmpty({ message: "El producto es requerida" })
  @IsProductExisting()
  product!: ProductEntity;

  @IsNotEmpty({ message: "El talle es requerida" })
  @IsSizeRelatedToProduct()
  size!: SizeEntity;

  @IsNotEmpty({ message: "El carrito es requerido" })
  @IsCartExisting()
  cart!: CartEntity;
}
