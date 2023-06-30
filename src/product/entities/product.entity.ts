import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { CategoryEntity } from "../../category/entities/category.entity";
import { OrderItemEntity } from "../../order/entities/order-item.entity";
import { ProductImageEntity } from "./product-image.entity";

@Entity({ name: "product" })
export class ProductEntity extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: "category_id" })
  category!: CategoryEntity;

  @OneToMany(() => ProductImageEntity, (productImage) => productImage.product)
  images!: ProductImageEntity[];

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
  orderItems!: OrderItemEntity[];
}
