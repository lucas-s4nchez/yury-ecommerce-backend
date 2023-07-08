import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { ImageDTO } from "../dto/image.dto";
import { UploadedFile } from "express-fileupload";

export class ImageMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  async fileValidator(req: Request, res: Response, next: NextFunction) {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
      return this.httpResponse.BadRequest(res, "No hay archivos que subir");
    }
    const file = req.files.file as UploadedFile;

    // Verificar que solo se haya enviado un archivo
    if (Array.isArray(file) && file instanceof Array) {
      return this.httpResponse.BadRequest(
        res,
        "Solo se permite enviar un archivo"
      );
    }

    // Verificar el tipo de archivo (por ejemplo, solo permitir imágenes)
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avip",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return this.httpResponse.BadRequest(res, "Tipo de archivo no válido");
    }

    next();
  }

  imageValidator(req: Request, res: Response, next: NextFunction) {
    const { url, public_id, product } = req.body;
    const validCategory = new ImageDTO();

    validCategory.url = url;
    validCategory.public_id = public_id;
    validCategory.product = product;

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
