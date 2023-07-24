import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { HttpResponse } from "../../shared/response/http.response";
import { DeleteResult, UpdateResult } from "typeorm";
import { OrderType } from "../../shared/types/shared.types";

export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService = new CategoryService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async categoryList(req: Request, res: Response) {
    try {
      const data = await this.categoryService.findAllCategories();

      if (data.length === 0) {
        return this.httpResponse.NotFound(res, "No hay categorias");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async getCategories(req: Request, res: Response) {
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

      const data = await this.categoryService.findAllCategoriesAndPaginate(
        pageNumber,
        limitNumber,
        order
      );

      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay categorías");
      }
      const [categories, count, totalPages] = data;
      return this.httpResponse.Ok(res, { categories, count, totalPages });
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

    if (categoryData.name) {
      categoryData.name = categoryData.name.toLowerCase();
    }

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
      const existingCategory = await this.categoryService.findCategoryById(id);
      if (!existingCategory) {
        return this.httpResponse.NotFound(res, "Categoria no encontrada");
      }

      // Verificar y actualizar categoria si es diferente
      if (categoryData.name !== existingCategory.name) {
        const isNameTaken = await this.categoryService.findCategoryByName(
          categoryData.name
        );
        if (isNameTaken) {
          return this.httpResponse.BadRequest(res, [
            {
              property: "name",
              errors: [
                `La categoria '${categoryData.name}' ya está registrada`,
              ],
            },
          ]);
        }
      }
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
      const existingCategory =
        await this.categoryService.findCategoryByIdForDelete(id);
      if (!existingCategory) {
        return this.httpResponse.NotFound(res, "Categoría no encontrada");
      }
      const deletedCategory = await this.categoryService.deleteCategory(
        existingCategory
      );
      if (!deletedCategory) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }
      return this.httpResponse.Ok(res, "Categoría eliminada correctamente");
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
