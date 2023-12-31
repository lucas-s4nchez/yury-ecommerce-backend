import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { validate } from "class-validator";
import { BrandDTO, UpdateBrandDTO } from "../dto/brand.dto";

export class BrandMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  brandValidator(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;

    const validProduct = new BrandDTO();

    validProduct.name = name.toLowerCase().trim();

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

  updateBrandValidator(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;

    const validBrand = new UpdateBrandDTO();

    validBrand.name = name.toLowerCase().trim();

    validate(validBrand).then((err) => {
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
