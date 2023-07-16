import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { OrderDTO } from "../dto/order.dto";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";

export class OrderMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  orderValidator(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, email, province, city, address, phone, dni } =
      req.user;
    const { totalPrice, totalItems } = req.cart;

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

    validate(validOrder).then((err) => {
      if (err.length > 0) {
        const formattedErrors = err.map((error) => ({
          property: error.property,
          errors: Object.keys(error.constraints!).map(
            (key) => error.constraints![key]
          ),
        }));
        return this.httpResponse.BadRequest(res, formattedErrors);
      } else {
        next();
      }
    });
  }
}
