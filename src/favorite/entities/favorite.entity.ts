import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { UserEntity } from "../../user/entities/user.entity";

@Entity({ name: "favorite" })
export class FavoriteEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.favorites)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.favorites)
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;
}
