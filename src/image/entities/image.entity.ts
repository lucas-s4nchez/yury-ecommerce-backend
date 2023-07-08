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

@Entity({ name: "image" })
export class ImageEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

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
