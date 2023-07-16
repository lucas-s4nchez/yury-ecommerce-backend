import { BaseService } from "../../config/base.service";
import { OrderItemEntity } from "../entities/order-item.entity";

export class OrderItemService extends BaseService<OrderItemEntity> {
  constructor() {
    super(OrderItemEntity);
  }

  async findAllOrderItems(): Promise<[OrderItemEntity[], number]> {
    return (await this.execRepository)
      .createQueryBuilder("order-items")
      .leftJoinAndSelect("order-items.order", "order")
      .leftJoinAndSelect("order-items.product", "product")
      .leftJoinAndSelect("product.images", "images")
      .getManyAndCount();
  }
  async findOrderItemById(id: string): Promise<OrderItemEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("order-items")
      .leftJoinAndSelect("order-items.order", "order")
      .leftJoinAndSelect("order-items.product", "product")
      .leftJoinAndSelect("product.images", "images")
      .where({ id })
      .getOne();
  }
}
