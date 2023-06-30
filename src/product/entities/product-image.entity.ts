import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "./product.entity";

@Entity({ name: "product_image" })
export class ProductImageEntity extends BaseEntity {
  @Column()
  url!: string;

  @Column()
  public_id!: string;

  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;
}
