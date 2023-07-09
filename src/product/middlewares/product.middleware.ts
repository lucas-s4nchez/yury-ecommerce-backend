import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { UploadedFile } from "express-fileupload";
import { ProductDTO } from "../dto/product.dto";
import { validate } from "class-validator";

export class ProductMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  uploadValidationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const files = req.files?.files as UploadedFile[];

    // Verificar si se seleccionó un archivo
    if (!files) {
      return this.httpResponse.BadRequest(res, {
        message: "No se seleccionó ninguna imagen.",
      });
    }

    // Verificar la cantidad de archivos seleccionados
    if (files.length > 4) {
      return this.httpResponse.BadRequest(res, {
        message: "Solo se permiten como máximo 4 fotos.",
      });
    }

    // Continuar con el flujo normal de la solicitud
    next();
  };

  productValidator(req: Request, res: Response, next: NextFunction) {
    const { name, description, price, category, brand, sizes, colors } =
      req.body;
    const validProduct = new ProductDTO();

    validProduct.name = name;
    validProduct.description = description;
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
}
