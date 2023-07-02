import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { CategoryEntity } from "../../category/entities/category.entity";
import { OrderItemEntity } from "../../order/entities/order-item.entity";
import { ImageEntity } from "./image.entity";
import { StockEntity } from "../../stock/entities/stock.entity";
import { BrandEntity } from "../../brand/entities/brand.entity";

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

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  @JoinColumn({ name: "brand_id" })
  brand!: BrandEntity;

  @OneToOne(() => StockEntity, (stock) => stock.product)
  stock!: StockEntity;

  @OneToMany(() => ImageEntity, (productImage) => productImage.product)
  images!: ImageEntity[];

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
  orderItems!: OrderItemEntity[];
}
