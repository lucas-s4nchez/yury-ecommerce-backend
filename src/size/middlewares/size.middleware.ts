import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { validate } from "class-validator";
import { SizeDTO, UpdateSizeDTO } from "../dto/size.dto";

export class SizeMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  async sizeValidator(req: Request, res: Response, next: NextFunction) {
    const { number } = req.body;
    const validSize = new SizeDTO();

    validSize.number = number;

    validate(validSize).then((err) => {
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
  async updateSizeValidator(req: Request, res: Response, next: NextFunction) {
    const { number } = req.body;
    const validSize = new UpdateSizeDTO();

    validSize.number = number;

    validate(validSize).then((err) => {
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
