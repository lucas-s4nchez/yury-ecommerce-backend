import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { IsAlpha, IsString } from "class-validator";

@Entity({ name: "category" })
export class CategoryEntity extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products!: ProductEntity[];
}
