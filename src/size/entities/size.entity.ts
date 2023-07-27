import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { CartItemEntity } from "../../cart/entities/cartItem.entity";

@Entity({ name: "size" })
export class SizeEntity extends BaseEntity {
  @Column({ type: "float" })
  number!: number;

  @ManyToMany(() => ProductEntity, (product) => product.sizes)
  products!: ProductEntity[];

  @OneToMany(() => CartItemEntity, (cartItems) => cartItems.size)
  cartItems!: CartItemEntity[];
}
