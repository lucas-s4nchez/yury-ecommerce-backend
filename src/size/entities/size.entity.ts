import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "../../product/entities/product.entity";

@Entity({ name: "size" })
export class SizeEntity extends BaseEntity {
  @Column({ unique: true, type: "float" })
  number!: number;

  @ManyToMany(() => ProductEntity, (product) => product.sizes)
  products!: ProductEntity[];
}
