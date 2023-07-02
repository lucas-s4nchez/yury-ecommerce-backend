import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { OrderType } from "../../shared/types/shared.types";
import { DeleteResult, UpdateResult } from "typeorm";
import { SizeService } from "../services/size.service";

export class SizeController {
  constructor(
    private readonly sizeService: SizeService = new SizeService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async sizeList(req: Request, res: Response) {
    try {
      const data = await this.sizeService.findAllSizes();

      if (data.length === 0) {
        return this.httpResponse.NotFound(res, "No hay talles");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getSizes(req: Request, res: Response) {
    try {
      let { page = 1, limit = 5, order = OrderType.ASC as any } = req.query;
      let pageNumber = parseInt(page as string, 10);
      let limitNumber = parseInt(limit as string, 10);

      // Validar si los valores son numéricos y mayores a 0
      if (isNaN(pageNumber) || pageNumber <= 0) {
        pageNumber = 1; // Valor predeterminado si no es un número válido
      }
      if (isNaN(limitNumber) || limitNumber <= 0) {
        limitNumber = 5; // Valor predeterminado si no es un número válido
      }

      // Validar el valor de order
      if (!(order in OrderType)) {
        order = OrderType.ASC; // Valor predeterminado si no es válido
      }

      const data = await this.sizeService.findAllSizesAndPaginate(
        pageNumber,
        limitNumber,
        order
      );
      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay talles");
      }
      const [sizes, count, totalPages] = data;
      return this.httpResponse.Ok(res, { sizes, count, totalPages });
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getSizeById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.sizeService.findSizeById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe este talle");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async createSize(req: Request, res: Response) {
    const sizeData = req.body;

    try {
      const data = await this.sizeService.createSize(sizeData);
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async updateSize(req: Request, res: Response) {
    const { id } = req.params;
    const sizeData = req.body;
    try {
      const existingSize = await this.sizeService.findSizeById(id);
      if (!existingSize) {
        return this.httpResponse.NotFound(res, "Talle no encontrado");
      }

      // Verificar y actualizar talle si es diferente
      if (sizeData.number !== existingSize.number) {
        const isNumberTaken = await this.sizeService.findSizeByNumber(
          sizeData.number
        );
        if (isNumberTaken) {
          return this.httpResponse.BadRequest(res, [
            {
              property: "number",
              errors: [`El talle '${sizeData.number}' ya está registrado`],
            },
          ]);
        }
      }
      const data: UpdateResult = await this.sizeService.updateSize(
        id,
        sizeData
      );
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteSize(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: DeleteResult = await this.sizeService.deleteSize(id);
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }

      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
