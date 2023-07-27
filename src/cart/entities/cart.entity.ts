import {
  AfterLoad,
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { CartItemEntity } from "./cartItem.entity";

@Entity({ name: "cart" })
export class CartEntity extends BaseEntity {
  @Column({ type: "float", default: 0 })
  totalPrice!: number;

  @Column({ type: "int" })
  totalItems!: number;

  @OneToOne(() => UserEntity, (user) => user.cart, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, {
    cascade: ["insert", "update", "remove"],
    eager: true,
  })
  cartItems!: CartItemEntity[];

  @AfterLoad()
  @BeforeInsert()
  @BeforeUpdate()
  @BeforeRemove()
  updateCartInfo(): void {
    this.calculateTotalPrice();
    this.calculateTotalItems();
  }

  calculateTotalPrice(): void {
    let totalPrice = 0;
    for (const cartItem of this.cartItems) {
      totalPrice += cartItem.subtotalPrice;
    }
    this.totalPrice = totalPrice;
  }

  calculateTotalItems(): void {
    let totalItems = 0;
    for (const cartItem of this.cartItems) {
      totalItems += cartItem.quantity;
    }
    this.totalItems = totalItems;
  }
}
