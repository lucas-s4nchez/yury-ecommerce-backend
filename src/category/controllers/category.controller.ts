import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { HttpResponse } from "../../shared/response/http.response";
import { DeleteResult, UpdateResult } from "typeorm";

export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService = new CategoryService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}
  async getCategories(req: Request, res: Response) {
    try {
      const data = await this.categoryService.findAllCategories();
      if (data.length === 0) {
        return this.httpResponse.NotFound(res, "No hay categorías");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async getCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.categoryService.findCategoryById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe esta categoría");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async createCategory(req: Request, res: Response) {
    const categoryData = req.body;
    try {
      const data = await this.categoryService.createCategory(categoryData);
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const categoryData = req.body;
    try {
      const data: UpdateResult = await this.categoryService.updateCategory(
        id,
        categoryData
      );
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: DeleteResult = await this.categoryService.deleteCategory(id);
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
}
