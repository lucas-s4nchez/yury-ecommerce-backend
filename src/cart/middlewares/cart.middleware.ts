import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { validate } from "class-validator";
import { CartDTO } from "../dto/cart.dto";

export class CartMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  async cartValidator(req: Request, res: Response, next: NextFunction) {
    const { user } = req.body;
    const validCart = new CartDTO();

    validCart.user = user;

    validate(validCart).then((err) => {
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
