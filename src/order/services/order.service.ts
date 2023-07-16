import { BaseService } from "../../config/base.service";
import { OrderEntity } from "../entities/order.entity";
import { OrderDTO, OrderStatusType } from "../dto/order.dto";
import { AppDataSource } from "../../config/data.source";
import { CartEntity } from "../../cart/entities/cart.entity";
import { OrderItemEntity } from "../entities/order-item.entity";
import { StockEntity } from "../../stock/entities/stock.entity";

export class OrderService extends BaseService<OrderEntity> {
  constructor() {
    super(OrderEntity);
  }

  async findAllOrders(): Promise<[OrderEntity[], number]> {
    return (await this.execRepository)
      .createQueryBuilder("orders")
      .leftJoinAndSelect("orders.user", "user")
      .leftJoinAndSelect("orders.orderItems", "orderItems")
      .getManyAndCount();
  }
  async findOrderById(id: string): Promise<OrderEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("orders")
      .leftJoinAndSelect("orders.user", "user")
      .leftJoinAndSelect("orders.orderItems", "orderItems")
      .where({ id })
      .getOne();
  }
  async createOrder(
    orderData: OrderDTO,
    cart: CartEntity
  ): Promise<OrderEntity | null> {
    // Crear un query runner
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //Crear una orden con los datos que trae el orderData
      const newOrder = new OrderEntity();
      Object.assign(newOrder, orderData);
      //Guardar la orden
      const savedOrder = await queryRunner.manager.save(newOrder);
      //Crear los orderItems y guardarlos
      for (const cartItem of cart.cartItems) {
        const newOrderItem = new OrderItemEntity();
        newOrderItem.name = cartItem.product.name;
        newOrderItem.description = cartItem.product.description;
        newOrderItem.price = cartItem.product.price;
        newOrderItem.quantity = cartItem.quantity;
        newOrderItem.subtotal = cartItem.subtotalPrice;
        newOrderItem.product = cartItem.product;
        newOrderItem.image = cartItem.product.images[0].url;
        newOrderItem.order = savedOrder;

        // Verificar la disponibilidad de stock
        const productStock = await queryRunner.manager.findOneBy(StockEntity, {
          id: cartItem.product.stock.id,
        });

        if (!productStock || productStock.quantity < newOrderItem.quantity) {
          throw new Error(
            `No hay suficiente stock disponible para el producto: ${cartItem.product.name}`
          );
        }

        // Actualizar el stock del producto
        productStock.quantity -= newOrderItem.quantity;
        await queryRunner.manager.save(productStock);

        // Guardar el orderItem
        await queryRunner.manager.save(newOrderItem);
      }

      // Confirmar la transacción
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelOrder(order: OrderEntity): Promise<OrderEntity> {
    (order.isPaid = false),
      (order.status = OrderStatusType.CANCELED),
      (order.isDelivered = false);
    //Todo:Devolver la cantidad de productos comprados al stock
    return (await this.execRepository).save(order);
  }
}
