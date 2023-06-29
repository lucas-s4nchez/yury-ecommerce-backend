import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { CategoryDTO } from "../dto/category.dto";
import { CategoryEntity } from "../entities/category.entity";
import { OrderType } from "../../shared/types/shared.types";

export class CategoryService extends BaseService<CategoryEntity> {
  constructor() {
    super(CategoryEntity);
  }

  async findAllCategories(
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
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [categories, count, totalPages];
  }

  async findCategoryById(id: string): Promise<CategoryEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("category")
      .where({ id })
      .getOne();
  }

  async findCategoryByName(name: string): Promise<CategoryEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("category")
      .addSelect("category.name")
      .where({ name })
      .getOne();
  }

  async createCategory(body: CategoryDTO): Promise<CategoryEntity> {
    return (await this.execRepository).save(body);
  }

  async updateCategory(id: string, body: CategoryDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteCategory(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
}
