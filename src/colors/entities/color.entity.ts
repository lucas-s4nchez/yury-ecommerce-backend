import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "../../product/entities/product.entity";

@Entity({ name: "color" })
export class ColorEntity extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column()
  hexCode!: string;

  @ManyToMany(() => ProductEntity, (product) => product.colors)
  products!: ProductEntity[];
}
