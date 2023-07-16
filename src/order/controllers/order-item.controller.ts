import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { OrderItemService } from "../services/order-item.service";

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
      console.log(e);
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
}
