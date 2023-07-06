import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { CartEntity } from "./cart.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { SizeEntity } from "../../size/entities/size.entity";

@Entity({ name: "cart_item" })
export class CartItemEntity extends BaseEntity {
  @ManyToOne(() => SizeEntity, (size) => size.cartItems)
  @JoinColumn({ name: "size_id" })
  size!: SizeEntity;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "float", default: 0 })
  subtotalPrice!: number;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.cartItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cart_id" })
  cart!: CartEntity;

  @AfterLoad()
  @BeforeInsert()
  @BeforeUpdate()
  updateSubtotalPrice(): void {
    this.calculateSubtotalPrice();
  }

  calculateSubtotalPrice(): void {
    if (this.product && this.product.price) {
      this.subtotalPrice = this.quantity * this.product.price;
    } else {
      this.subtotalPrice = 0;
    }
  }
}
