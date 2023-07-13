import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "../../product/entities/product.entity";

@Entity({ name: "brand" })
export class BrandEntity extends BaseEntity {
  @Column()
  name!: string;

  @OneToMany(() => ProductEntity, (product) => product.brand)
  products!: ProductEntity[];
}
