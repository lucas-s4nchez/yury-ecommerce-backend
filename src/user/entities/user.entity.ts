import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { OrderEntity } from "../../order/entities/order.entity";
import { RoleType } from "../types/role.types";
import { CartEntity } from "../../cart/entities/cart.entity";

@Entity({ name: "user" })
export class UserEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) //Para que no muestre el password
  password!: string;

  @Column({ nullable: true })
  province!: string;

  @Column({ nullable: true })
  city!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  dni!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({
    type: "enum",
    enum: RoleType,
    nullable: false,
    default: RoleType.USER,
  })
  role!: RoleType;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders!: OrderEntity[];

  @OneToOne(() => CartEntity, (cart) => cart.user, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  cart!: CartEntity;
}
