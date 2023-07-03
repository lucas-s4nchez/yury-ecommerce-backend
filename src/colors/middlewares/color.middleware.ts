import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { validate } from "class-validator";
import { ColorDTO, UpdateColorDTO } from "../dto/color.dto";

export class ColorMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  async colorValidator(req: Request, res: Response, next: NextFunction) {
    const { name, hexCode } = req.body;
    const validSize = new ColorDTO();

    validSize.name = name;
    validSize.hexCode = hexCode;

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
  async updateColorValidator(req: Request, res: Response, next: NextFunction) {
    const { name, hexCode } = req.body;
    const validSize = new UpdateColorDTO();

    validSize.name = name;
    validSize.hexCode = hexCode;

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
