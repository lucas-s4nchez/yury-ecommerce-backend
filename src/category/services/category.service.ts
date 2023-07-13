import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { CategoryDTO } from "../dto/category.dto";
import { CategoryEntity } from "../entities/category.entity";
import { OrderType } from "../../shared/types/shared.types";
import { ProductService } from "../../product/services/product.service";

export class CategoryService extends BaseService<CategoryEntity> {
  constructor(private productService: ProductService = new ProductService()) {
    super(CategoryEntity);
  }

  async findAllCategories(): Promise<CategoryEntity[]> {
    return (await this.execRepository)
      .createQueryBuilder("categories")
      .where({ state: true })
      .getMany();
  }

  async findAllCategoriesAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[CategoryEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [categories, count] = await (await this.execRepository)
      .createQueryBuilder("categories")
      .orderBy("categories.name", order)
      .skip(skipCount)
      .take(limit)
      .where({ state: true })
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [categories, count, totalPages];
  }

  async findCategoryById(id: string): Promise<CategoryEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("category")
      .where({ id, state: true })
      .getOne();
  }

  async findCategoryByIdForDelete(id: string): Promise<CategoryEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.products", "products")
      .where({ id, state: true })
      .getOne();
  }

  async findCategoryByName(name: string): Promise<CategoryEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("category")
      .addSelect("category.name")
      .where({ name, state: true })
      .getOne();
  }

  async createCategory(body: CategoryDTO): Promise<CategoryEntity> {
    return (await this.execRepository).save(body);
  }

  async updateCategory(id: string, body: CategoryDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteCategory(id: string): Promise<CategoryEntity | null> {
    // Obtener el producto existente
    const existingCategory = await this.findCategoryByIdForDelete(id);
    if (!existingCategory) {
      return null;
    }

    // Eliminar los productos relacionados relacionadas
    const products = existingCategory.products;
    for (const product of products) {
      await this.productService.deleteProductAndRelatedEntities(product.id);
    }

    // Actualizar el estado de la categoria
    existingCategory.state = false;

    // Guardar los cambios en la base de datos
    const updateResult = (await this.execRepository).save(existingCategory);
    return updateResult;
  }
}
