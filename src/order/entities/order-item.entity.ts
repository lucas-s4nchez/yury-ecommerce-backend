import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { OrderEntity } from "./order.entity";

@Entity({ name: "order_items" })
export class OrderItemEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @Column()
  quantity!: number;

  @Column()
  subtotal!: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  @JoinColumn({ name: "order_id" })
  order!: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems)
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;
}
