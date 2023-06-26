import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { CategoryEntity } from "../../category/entities/category.entity";
import { OrderItemEntity } from "../../order/entities/order-item.entity";

@Entity({ name: "product" })
export class ProductEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: "category_id" })
  category!: CategoryEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
  orderItem!: OrderItemEntity[];
}
