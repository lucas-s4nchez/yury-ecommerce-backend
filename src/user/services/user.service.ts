import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { RoleType, UserDTO } from "../dto/user.dto";
import { UserEntity } from "../entities/user.entity";
import { UserCustomerDTO } from "../dto/user-customer.dto";

export class UserService extends BaseService<UserEntity> {
  constructor() {
    super(UserEntity);
  }

  async findAllUsers(): Promise<[UserEntity[], number]> {
    return (await this.execRepository)
      .createQueryBuilder("users")
      .getManyAndCount();
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("users")
      .where({ id })
      .getOne();
  }

  async createUser(body: UserDTO): Promise<UserEntity> {
    return (await this.execRepository).save(body);
  }

  async updateUserToCustomer(id: string): Promise<any> {
    return (await this.execRepository).update(
      { id },
      { role: RoleType.CUSTOMER }
    );
  }

  async updateBasicUser(id: string, body: UserDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async updateAdvancedUser(
    id: string,
    body: UserCustomerDTO
  ): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
}
