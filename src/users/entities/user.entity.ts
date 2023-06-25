import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { CustomerEntity } from "../../customer/entities/customer.entity";
import { Exclude } from "class-transformer";
import { RoleType } from "../dto/user.dto";

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

  @Column({ type: "enum", enum: RoleType, nullable: false })
  role!: RoleType;

  @OneToOne(() => CustomerEntity, (customer) => customer.user)
  customer!: CustomerEntity;
}
