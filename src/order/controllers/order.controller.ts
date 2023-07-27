import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { OrderService } from "../services/order.service";
import { OrderDTO } from "../dto/order.dto";
import { validate } from "class-validator";
import { OrderType } from "../../shared/types/shared.types";

export class OrderController {
  constructor(
    private readonly orderService: OrderService = new OrderService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getAllOrders(req: Request, res: Response) {
    try {
      let { page = 1, limit = 5, order = OrderType.ASC as any } = req.query;
      let pageNumber = parseInt(page as string, 10);
      let limitNumber = parseInt(limit as string, 10);

      // Validar si los valores son numéricos y mayores a 0
      if (isNaN(pageNumber) || pageNumber <= 0) {
        pageNumber = 1; // Valor predeterminado si no es un número válido
      }
      if (isNaN(limitNumber) || limitNumber <= 0) {
        limitNumber = 5; // Valor predeterminado si no es un número válido
      }

      // Validar el valor de order
      if (!(order in OrderType)) {
        order = OrderType.ASC; // Valor predeterminado si no es válido
      }

      const data = await this.orderService.findAllOrders(
        pageNumber,
        limitNumber,
        order
      );

      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay ordenes");
      }

      const [orders, count, totalPages] = data;

      return this.httpResponse.Ok(res, { orders, count, totalPages });
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getOrdersByUserId(req: Request, res: Response) {
    const userId = req.user.id;
    try {
      let { page = 1, limit = 5, order = OrderType.ASC as any } = req.query;
      let pageNumber = parseInt(page as string, 10);
      let limitNumber = parseInt(limit as string, 10);

      // Validar si los valores son numéricos y mayores a 0
      if (isNaN(pageNumber) || pageNumber <= 0) {
        pageNumber = 1; // Valor predeterminado si no es un número válido
      }
      if (isNaN(limitNumber) || limitNumber <= 0) {
        limitNumber = 5; // Valor predeterminado si no es un número válido
      }

      // Validar el valor de order
      if (!(order in OrderType)) {
        order = OrderType.ASC; // Valor predeterminado si no es válido
      }

      const data = await this.orderService.findOrdersByUserId(
        userId,
        pageNumber,
        limitNumber,
        order
      );

      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay ordenes");
      }

      const [orders, count, totalPages] = data;

      return this.httpResponse.Ok(res, { orders, count, totalPages });
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
    const { name, lastName, email, province, city, address, phone, dni } =
      req.user;
    const { totalPrice, totalItems } = req.cart;

    try {
      const validOrder = new OrderDTO();
      validOrder.name = name;
      validOrder.lastName = lastName;
      validOrder.email = email;
      validOrder.province = province;
      validOrder.city = city;
      validOrder.address = address;
      validOrder.phone = phone;
      validOrder.dni = dni;
      validOrder.totalPrice = totalPrice;
      validOrder.totalItems = totalItems;
      validOrder.user = req.user;

      validate(validOrder).then(async (err) => {
        if (err.length > 0) {
          const formattedErrors = err.map((error) => ({
            property: error.property,
            errors: Object.keys(error.constraints!).map(
              (key) => error.constraints![key]
            ),
          }));
          return this.httpResponse.BadRequest(res, formattedErrors);
        } else {
          const order = await this.orderService.createOrder(
            validOrder,
            req.cart
          );
          if (!order) {
            return this.httpResponse.BadRequest(
              res,
              "Hubo un error al crear la orden, verifica que los productos que intentas comprar tengan stock disponible"
            );
          }
          return this.httpResponse.Ok(res, order);
        }
      });
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async cancelOrder(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const existingOrder = await this.orderService.findPendingOrderById(id);
      if (!existingOrder) {
        return this.httpResponse.NotFound(res, "Orden no encontrada");
      }
      const updatedOrder = await this.orderService.cancelOrder(existingOrder);
      if (!updatedOrder) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, existingOrder);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async completeOrder(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const existingOrder = await this.orderService.findPendingOrderById(id);
      if (!existingOrder) {
        return this.httpResponse.NotFound(res, "Orden no encontrada");
      }
      const updatedOrder = await this.orderService.completeOrder(existingOrder);
      if (!updatedOrder) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, existingOrder);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
