import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { CategoryDTO } from "../dto/category.dto";
import { CategoryEntity } from "../entities/category.entity";
import { OrderType } from "../../shared/types/shared.types";
import { ProductService } from "../../product/services/product.service";
import { AppDataSource } from "../../config/data.source";
import { ProductEntity } from "../../product/entities/product.entity";
import { ImageEntity } from "../../image/entities/image.entity";
import { StockEntity } from "../../stock/entities/stock.entity";

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

  async deleteCategory(
    category: CategoryEntity
  ): Promise<CategoryEntity | null> {
    // Crear un query runner
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //Eliminar los productos relacionados
      const products = category.products;
      for (const product of products) {
        const existingProduct = await queryRunner.manager.findOne(
          ProductEntity,
          {
            where: { id: product.id, state: true },
            relations: [
              "category",
              "images",
              "stock",
              "sizes",
              "colors",
              "brand",
              "cartItems",
              "favorites",
            ],
          }
        );
        if (existingProduct) {
          // Eliminar las imágenes relacionadas
          const images = existingProduct.images;
          for (const image of images) {
            const existingImage = await queryRunner.manager.findOneBy(
              ImageEntity,
              {
                id: image.id,
              }
            );
            if (existingImage) {
              existingImage.state = false;
              await queryRunner.manager.save(existingImage);
            }
          }

          // Eliminar el stock relacionado
          const stock = existingProduct.stock;
          if (stock) {
            const existingStock = await queryRunner.manager.findOneBy(
              StockEntity,
              {
                id: stock.id,
              }
            );
            if (existingStock) {
              existingStock.state = false;
              await queryRunner.manager.save(existingStock);
            }
          }

          // Eliminar los items del carrito relacionados al producto
          const cartItems = existingProduct.cartItems;
          if (cartItems) {
            for (const cartItem of cartItems) {
              await queryRunner.manager.remove(cartItem);
            }
          }

          // Eliminar los favoritos relacionados al producto
          const favorites = existingProduct.favorites;
          if (favorites) {
            for (const favorite of favorites) {
              await queryRunner.manager.remove(favorite);
            }
          }

          // Actualizar el estado del producto
          existingProduct.state = false;
          existingProduct.available = false;

          //Guardar
          await queryRunner.manager.save(existingProduct);
        }
      }

      // Actualizar el estado de la categoría
      category.state = false;

      const updateResult = await queryRunner.manager.save(category);

      // Commit de la transacción
      await queryRunner.commitTransaction();

      return updateResult;
    } catch (error) {
      // Rollback de la transacción en caso de error
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      // Liberar el query runner
      await queryRunner.release();
    }
  }
}
