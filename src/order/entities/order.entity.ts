import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { OrderItemEntity } from "./order-item.entity";
import { UserEntity } from "../../user/entities/user.entity";

@Entity({ name: "order" })
export class OrderEntity extends BaseEntity {
  @Column()
  status!: string;

  @Column()
  paymentMethod!: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: "customer_id" })
  customer!: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems!: OrderItemEntity[];
}
