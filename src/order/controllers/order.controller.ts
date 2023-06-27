import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { DeleteResult, UpdateResult } from "typeorm";
import { OrderService } from "../services/order.service";
import { OrderDTO } from "../dto/order.dto";
import { validate } from "class-validator";

export class OrderController {
  constructor(
    private readonly orderService: OrderService = new OrderService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getOrders(req: Request, res: Response) {
    try {
      const data = await this.orderService.findAllOrders();

      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay ordenes");
      }

      const [orders, count] = data;

      return this.httpResponse.Ok(res, { orders, count });
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getOrderById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.orderService.findOrderById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe esta orden");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async createOrder(req: Request, res: Response) {
    const orderData = req.body;
    try {
      const orderDTO = new OrderDTO();
      Object.assign(orderDTO, orderData);

      const errors = await validate(orderDTO);
      if (errors.length > 0) {
        return this.httpResponse.BadRequest(res, errors);
      }
      const data = await this.orderService.createOrder(orderData);
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async updateOrder(req: Request, res: Response) {
    const { id } = req.params;
    const orderData = req.body;
    try {
      const data: UpdateResult = await this.orderService.updateOrder(
        id,
        orderData
      );
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteOrder(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: DeleteResult = await this.orderService.deleteOrder(id);
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
}
