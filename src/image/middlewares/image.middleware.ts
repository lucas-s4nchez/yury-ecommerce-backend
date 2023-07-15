import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
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

    // Verificar el tipo de archivo (solo permitir imágenes)
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
}
