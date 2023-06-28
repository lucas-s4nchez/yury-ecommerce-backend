import { DeleteResult, UpdateResult } from "typeorm";
import * as bcrypt from "bcrypt";
import { BaseService } from "../../config/base.service";
import { UserEntity } from "../entities/user.entity";
import { RoleType } from "../types/role.types";
import {
  CreateUserDTO,
  UpdateAdvancedUserDTO,
  UpdateBasicUserDTO,
} from "../dto/user.dto";

export class UserService extends BaseService<UserEntity> {
  constructor() {
    super(UserEntity);
  }

  async findAllUsers(): Promise<[UserEntity[], number]> {
    return (await this.execRepository)
      .createQueryBuilder("users")
      .getManyAndCount();
  }

  async findUserWithRole(
    id: string,
    role: RoleType
  ): Promise<UserEntity | null> {
    const user = (await this.execRepository)
      .createQueryBuilder("user")
      .where({ id })
      .andWhere({ role })
      .getOne();

    return user;
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("users")
      .where({ id })
      .getOne();
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("users")
      .addSelect("users.password")
      .where({ email })
      .getOne();
  }

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("users")
      .addSelect("users.password")
      .where({ username })
      .getOne();
  }

  async createUser(body: CreateUserDTO): Promise<UserEntity> {
    const newUser = (await this.execRepository).create(body);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    return (await this.execRepository).save(newUser);
  }

  async updateUserToCustomer(id: string): Promise<any> {
    return (await this.execRepository).update(
      { id },
      { role: RoleType.CUSTOMER }
    );
  }

  async updateBasicUser(
    id: string,
    body: UpdateBasicUserDTO
  ): Promise<UpdateResult> {
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    return (await this.execRepository).update({ id }, body);
  }

  async updateAdvancedUser(
    id: string,
    body: UpdateAdvancedUserDTO
  ): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
}
