import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "../../product/entities/product.entity";

@Entity({ name: "stock" })
export class StockEntity extends BaseEntity {
  @Column()
  quantity!: number;

  @OneToOne(() => ProductEntity, (product) => product.stock, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;
}
