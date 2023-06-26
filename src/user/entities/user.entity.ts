import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { Exclude } from "class-transformer";
import { RoleType } from "../dto/user.dto";
import { OrderEntity } from "../../order/entities/order.entity";

@Entity({ name: "user" })
export class UserEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  lastName!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Exclude() //Para que no muestre el password
  @Column()
  password!: string;

  @Column({ nullable: true })
  province!: string;

  @Column({ nullable: true })
  city!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  dni!: number;

  @Column({ nullable: true })
  phone!: string;

  @Column({
    type: "enum",
    enum: RoleType,
    nullable: false,
    default: RoleType.USER,
  })
  role!: RoleType;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders!: OrderEntity[];
}
