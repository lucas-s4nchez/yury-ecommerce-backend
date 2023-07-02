import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { BrandService } from "../services/brand.service";
import { OrderType } from "../../shared/types/shared.types";
import { DeleteResult, UpdateResult } from "typeorm";

export class BrandController {
  constructor(
    private readonly brandService: BrandService = new BrandService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async brandList(req: Request, res: Response) {
    try {
      const data = await this.brandService.findAllBrands();

      if (data.length === 0) {
        return this.httpResponse.NotFound(res, "No hay marcas");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getBrands(req: Request, res: Response) {
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

      const data = await this.brandService.findAllBrandsAndPaginate(
        pageNumber,
        limitNumber,
        order
      );
      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay marcas");
      }
      const [brands, count, totalPages] = data;
      return this.httpResponse.Ok(res, { brands, count, totalPages });
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getBrandById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.brandService.findBrandById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe esta marca");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async createBrand(req: Request, res: Response) {
    const brandData = req.body;

    try {
      const data = await this.brandService.createBrand(brandData);
      console.log(data);
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async updateBrand(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const data: UpdateResult = await this.brandService.updateBrand(id, name);
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: DeleteResult = await this.brandService.deleteBrand(id);
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