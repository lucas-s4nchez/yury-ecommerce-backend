import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { validate } from "class-validator";
import { StockDTO, UpdateStockDTO } from "../dto/stock.dto";

export class StockMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  stockValidator(req: Request, res: Response, next: NextFunction) {
    const { quantity, product } = req.body;
    const validProduct = new StockDTO();

    validProduct.quantity = quantity;
    validProduct.product = product;

    validate(validProduct).then((err) => {
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
  updateStockValidator(req: Request, res: Response, next: NextFunction) {
    const { quantity } = req.body;
    const validProduct = new UpdateStockDTO();

    validProduct.quantity = quantity;

    validate(validProduct).then((err) => {
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
