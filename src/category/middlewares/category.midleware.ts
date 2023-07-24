import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { CategoryDTO, UpdateCategoryDTO } from "../dto/category.dto";

export class CategoryMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  categoryValidator(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;

    const validCategory = new CategoryDTO();

    validCategory.name = name.toLowerCase().trim();

    validate(validCategory).then((err) => {
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

  updateCategoryValidator(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;

    const validCategory = new UpdateCategoryDTO();

    validCategory.name = name.toLowerCase().trim();

    validate(validCategory).then((err) => {
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
