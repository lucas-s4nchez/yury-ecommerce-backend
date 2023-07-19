import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "../../product/entities/product.entity";

@Entity({ name: "favorite" })
export class FavoriteEntity extends BaseEntity {
  @ManyToOne(() => ProductEntity, (product) => product.favorites)
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;
}
