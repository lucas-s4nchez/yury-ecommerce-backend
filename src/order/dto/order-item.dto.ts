import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { OrderEntity } from "../entities/order.entity";
import { ProductEntity } from "../../product/entities/product.entity";

class OrderItemDTO extends BaseDTO {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  price!: number;

  @IsNotEmpty()
  quantity!: number;

  @IsNotEmpty()
  subtotal!: number;

  @IsNotEmpty()
  order!: OrderEntity;

  @IsNotEmpty()
  product!: ProductEntity;
}
