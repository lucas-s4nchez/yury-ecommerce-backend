import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { OrderItemEntity } from "./order-item.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { OrderStatusType, PaymentMethodsType } from "../dto/order.dto";

@Entity({ name: "order" })
export class OrderEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column()
  province!: string;

  @Column()
  city!: string;

  @Column()
  address!: string;

  @Column()
  dni!: number;

  @Column()
  phone!: string;

  @Column({
    type: "enum",
    enum: OrderStatusType,
    nullable: false,
    default: OrderStatusType.PENDING,
  })
  status!: OrderStatusType;

  @Column({
    type: "enum",
    enum: PaymentMethodsType,
    nullable: false,
  })
  paymentMethod!: PaymentMethodsType;

  @Column({ type: Boolean, default: false })
  isPaid!: boolean;

  @Column()
  total!: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems!: OrderItemEntity[];

  @Column()
  numberOfItems!: number;
}
