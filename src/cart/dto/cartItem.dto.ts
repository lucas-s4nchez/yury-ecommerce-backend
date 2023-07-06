import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { ProductEntity } from "../../product/entities/product.entity";
import { CartEntity } from "../entities/cart.entity";
import { SizeEntity } from "../../size/entities/size.entity";

export class CartItemDTO extends BaseDTO {
  @IsNotEmpty({ message: "La cantidad es requerida" })
  quantity!: number;

  @IsNotEmpty({ message: "El producto es requerida" })
  product!: ProductEntity;

  @IsNotEmpty({ message: "El talle es requerida" })
  size!: SizeEntity;

  @IsNotEmpty({ message: "El carrito es requerido" })
  cart!: CartEntity;
}
