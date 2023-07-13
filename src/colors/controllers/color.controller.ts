import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { OrderType } from "../../shared/types/shared.types";
import { DeleteResult, UpdateResult } from "typeorm";
import { ColorService } from "../services/color.service";

export class ColorController {
  constructor(
    private readonly colorService: ColorService = new ColorService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async colorList(req: Request, res: Response) {
    try {
      const data = await this.colorService.findAllColors();

      if (data.length === 0) {
        return this.httpResponse.NotFound(res, "No hay colores");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getColors(req: Request, res: Response) {
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

      const data = await this.colorService.findAllColorsAndPaginate(
        pageNumber,
        limitNumber,
        order
      );
      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay colores");
      }
      const [colors, count, totalPages] = data;
      return this.httpResponse.Ok(res, { colors, count, totalPages });
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getColorById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.colorService.findColorById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe este color");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async createColor(req: Request, res: Response) {
    const colorData = req.body;
    colorData.name = colorData.name.toLowerCase().trim();
    colorData.hexCode = colorData.hexCode.toUpperCase().trim();

    try {
      const data = await this.colorService.createColor(colorData);
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async updateColor(req: Request, res: Response) {
    const { id } = req.params;
    const colorData = req.body;
    colorData.name = colorData.name.toLowerCase().trim();
    colorData.hexCode = colorData.hexCode.toUpperCase().trim();
    try {
      const existingColor = await this.colorService.findColorById(id);
      if (!existingColor) {
        return this.httpResponse.NotFound(res, "Color no encontrado");
      }

      // Verificar y actualizar color si es diferente
      if (colorData.name !== existingColor.name) {
        const isNameTaken = await this.colorService.findColorByName(
          colorData.name
        );
        if (isNameTaken) {
          return this.httpResponse.BadRequest(res, [
            {
              property: "name",
              errors: [`El color '${colorData.name}' ya está registrado`],
            },
          ]);
        }
      }
      const data: UpdateResult = await this.colorService.updateColor(
        id,
        colorData
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

  async deleteColor(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const existingColor = await this.colorService.findColorById(id);
      if (!existingColor) {
        return this.httpResponse.NotFound(res, "Color no encontrado");
      }
      const deletedColor = await this.colorService.deleteColor(id);
      if (!deletedColor) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }
      return this.httpResponse.Ok(res, "Color eliminado correctamente");
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
