import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { ProductDTO, UpdateProductDTO } from "../dto/product.dto";
import { validate } from "class-validator";

export class ProductMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  productValidator(req: Request, res: Response, next: NextFunction) {
    const { name, description, price, category, brand, sizes, colors } =
      req.body;
    const validProduct = new ProductDTO();

    validProduct.name = name.toLowerCase().trim();
    validProduct.description = description.trim();
    validProduct.price = price;
    validProduct.category = category;
    validProduct.brand = brand;
    validProduct.colors = colors;
    validProduct.sizes = sizes;

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

  productUpdateValidator(req: Request, res: Response, next: NextFunction) {
    const {
      name,
      description,
      price,
      category,
      brand,
      sizes,
      colors,
      featured,
    } = req.body;
    const validProduct = new UpdateProductDTO();

    validProduct.name = name;
    validProduct.description = description;
    validProduct.price = price;
    validProduct.featured = featured;
    validProduct.category = category;
    validProduct.brand = brand;
    validProduct.colors = colors;
    validProduct.sizes = sizes;

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
