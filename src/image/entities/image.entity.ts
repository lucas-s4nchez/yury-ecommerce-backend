import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductEntity } from "../../product/entities/product.entity";
import { BaseEntity } from "../../config/base.entity";

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
