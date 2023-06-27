import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { OrderItemEntity } from "../entities/order-item.entity";
import { OrderItemDTO } from "../dto/order-item.dto";

export class OrderItemService extends BaseService<OrderItemEntity> {
  constructor() {
    super(OrderItemEntity);
  }

  async findAllOrderItems(): Promise<[OrderItemEntity[], number]> {
    return (await this.execRepository)
      .createQueryBuilder("order-items")
      .leftJoinAndSelect("order-items.order", "order")
      .getManyAndCount();
  }
  async findOrderItemById(id: string): Promise<OrderItemEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("order-items")
      .leftJoinAndSelect("order-items.order", "order")
      .where({ id })
      .getOne();
  }
  async createOrderItem(body: OrderItemDTO): Promise<OrderItemEntity> {
    return (await this.execRepository).save(body);
  }
  async deleteOrderItem(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
  async updateOrderItem(
    id: string,
    infoUpdate: OrderItemDTO
  ): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }
}
