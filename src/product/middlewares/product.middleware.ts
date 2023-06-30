import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { UploadedFile } from "express-fileupload";

export class ProductMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  uploadValidationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const archivo = req.files?.archivo as UploadedFile[];

    // Verificar si se seleccionó un archivo
    if (!archivo) {
      return this.httpResponse.BadRequest(res, {
        message: "No se seleccionó ninguna imagen.",
      });
    }

    // Verificar la cantidad de archivos seleccionados
    if (archivo.length > 4) {
      return this.httpResponse.BadRequest(res, {
        message: "Solo se permiten como máximo 4 fotos.",
      });
    }

    // Continuar con el flujo normal de la solicitud
    next();
  };
}
