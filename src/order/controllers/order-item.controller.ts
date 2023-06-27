import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { DeleteResult, UpdateResult } from "typeorm";
import { OrderItemService } from "../services/order-item.service";
import { OrderItemDTO } from "../dto/order-item.dto";
import { validate } from "class-validator";

export class OrderItemController {
  constructor(
    private readonly orderItemService: OrderItemService = new OrderItemService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getOrderItems(req: Request, res: Response) {
    try {
      const data = await this.orderItemService.findAllOrderItems();

      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay items de orden");
      }

      const [orderItems, count] = data;

      return this.httpResponse.Ok(res, { orderItems, count });
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getOrderItemById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.orderItemService.findOrderItemById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe este item de orden");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async createOrderItem(req: Request, res: Response) {
    const orderItemData = req.body;
    try {
      const orderItemDTO = new OrderItemDTO();
      Object.assign(orderItemDTO, orderItemData);

      const errors = await validate(orderItemDTO);
      if (errors.length > 0) {
        return this.httpResponse.BadRequest(res, errors);
      }
      const data = await this.orderItemService.createOrderItem(orderItemData);
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async updateOrderItem(req: Request, res: Response) {
    const { id } = req.params;
    const orderItemData = req.body;
    try {
      const data: UpdateResult = await this.orderItemService.updateOrderItem(
        id,
        orderItemData
      );
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteOrderItem(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: DeleteResult = await this.orderItemService.deleteOrderItem(
        id
      );
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
}
