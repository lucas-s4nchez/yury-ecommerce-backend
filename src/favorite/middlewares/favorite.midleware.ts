import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { FavoriteDTO } from "../dto/favorite.dto";

export class FavoriteMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  favoriteValidator(req: Request, res: Response, next: NextFunction) {
    const { product } = req.body;
    const validfavorite = new FavoriteDTO();

    validfavorite.product = product;

    validate(validfavorite).then((err) => {
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
