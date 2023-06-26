import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { UserDTO } from "../dto/user.dto";
import { UserEntity } from "../entities/user.entity";

export class UserService extends BaseService<UserEntity> {
  constructor() {
    super(UserEntity);
  }

  async findAllUsers(): Promise<[UserEntity[], number]> {
    return (await this.execRepository)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.customer", "customer")
      .getManyAndCount();
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.customer", "customer")
      .where({ id })
      .getOne();
  }

  async createUser(body: UserDTO): Promise<UserEntity> {
    return (await this.execRepository).save(body);
  }

  async updateUser(id: string, body: UserDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
}
