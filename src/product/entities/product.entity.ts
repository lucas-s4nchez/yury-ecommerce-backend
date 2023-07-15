import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { CategoryEntity } from "../../category/entities/category.entity";
import { OrderItemEntity } from "../../order/entities/order-item.entity";
import { StockEntity } from "../../stock/entities/stock.entity";
import { BrandEntity } from "../../brand/entities/brand.entity";
import { SizeEntity } from "../../size/entities/size.entity";
import { ColorEntity } from "../../colors/entities/color.entity";
import { CartItemEntity } from "../../cart/entities/cartItem.entity";
import { ImageEntity } from "../../image/entities/image.entity";

@Entity({ name: "product" })
export class ProductEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ type: "float" })
  price!: number;

  @Column({ type: "boolean", default: false })
  featured!: boolean;

  @Column({ type: "boolean", default: false })
  available!: boolean;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category!: CategoryEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.products, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "brand_id" })
  brand!: BrandEntity;

  @OneToOne(() => StockEntity, (stock) => stock.product)
  stock!: StockEntity;

  @OneToMany(() => ImageEntity, (productImage) => productImage.product)
  images!: ImageEntity[];

  @ManyToMany(() => SizeEntity, (size) => size.products)
  @JoinTable({
    name: "product_size",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "size_id",
      referencedColumnName: "id",
    },
  })
  sizes!: SizeEntity[];

  @ManyToMany(() => ColorEntity, (color) => color.products)
  @JoinTable({
    name: "product_color",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "color_id",
      referencedColumnName: "id",
    },
  })
  colors!: ColorEntity[];

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
  cartItems!: CartItemEntity[];

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
  orderItems!: OrderItemEntity[];
}
