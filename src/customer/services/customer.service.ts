import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { CustomerEntity } from "../entities/customer.entity";
import { CustomerDTO } from "../dto/customer.dto";
import { UserService } from "../../user/services/user.service";
import { RoleType } from "../../user/dto/user.dto";

export class CustomerService extends BaseService<CustomerEntity> {
  constructor(private userService: UserService = new UserService()) {
    super(CustomerEntity);
  }

  async findAllCustomers(): Promise<[CustomerEntity[], number]> {
    return (await this.execRepository)
      .createQueryBuilder("customers")
      .leftJoinAndSelect("customers.user", "user")
      .getManyAndCount();
  }
  async findCustomerById(id: string): Promise<CustomerEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("customers")
      .leftJoinAndSelect("customers.user", "user")
      .where({ id })
      .getOne();
  }
  async createCustomer(body: CustomerDTO): Promise<CustomerEntity | null> {
    const createCustomer = (await this.execRepository).create(body);
    const user = await this.userService.findUserById(createCustomer.user.id);
    if (user && user.role !== RoleType.CUSTOMER) {
      await this.userService.updateUser(user.id, {
        ...user,
        role: RoleType.CUSTOMER,
      });

      return (await this.execRepository).save(body);
    }

    return null;
  }
  async deleteCustomer(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
  async updateCustomer(
    id: string,
    infoUpdate: CustomerDTO
  ): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }
}
