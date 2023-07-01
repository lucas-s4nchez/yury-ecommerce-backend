import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "./product.entity";

@Entity({ name: "image" })
export class ImageEntity extends BaseEntity {
  @Column()
  url!: string;

  @Column()
  public_id!: string;

  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id", referencedColumnName: "id" })
  product!: ProductEntity;
}
