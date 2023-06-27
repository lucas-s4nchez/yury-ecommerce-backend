import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { OrderEntity } from "../entities/order.entity";
import { OrderDTO } from "../dto/order.dto";

export class OrderService extends BaseService<OrderEntity> {
  constructor() {
    super(OrderEntity);
  }

  async findAllOrders(): Promise<[OrderEntity[], number]> {
    return (await this.execRepository)
      .createQueryBuilder("orders")
      .leftJoinAndSelect("orders.user", "user")
      .getManyAndCount();
  }
  async findOrderById(id: string): Promise<OrderEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("orders")
      .leftJoinAndSelect("orders.user", "user")
      .where({ id })
      .getOne();
  }
  async createOrder(body: OrderDTO): Promise<OrderEntity> {
    return (await this.execRepository).save(body);
  }
  async deleteOrder(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
  async updateOrder(id: string, infoUpdate: OrderDTO): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }
}
