import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { validate } from "class-validator";
import { CartDTO } from "../dto/cart.dto";
import { CartItemDTO } from "../dto/cartItem.dto";

export class CartItemMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  async cartItemValidator(req: Request, res: Response, next: NextFunction) {
    req.body.cart = req.user.cart.id; // insertar el id del carrito al req.body
    const { quantity, product, size, cart } = req.body;
    const validCartItem = new CartItemDTO();

    validCartItem.quantity = quantity;
    validCartItem.product = product;
    validCartItem.cart = cart;
    validCartItem.size = size;

    validate(validCartItem).then((err) => {
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
