import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { IsSizeUnique } from "../validators/size-unique.validator";

@Entity({ name: "size" })
export class SizeEntity extends BaseEntity {
  @Column({ unique: true })
  @IsSizeUnique()
  number!: number;

  @ManyToMany(() => ProductEntity, (product) => product.sizes)
  products!: ProductEntity[];
}
