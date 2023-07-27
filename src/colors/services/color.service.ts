import { UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { OrderType } from "../../shared/types/shared.types";
import { ColorEntity } from "../entities/color.entity";
import { ColorDTO } from "../dto/color.dto";
import { AppDataSource } from "../../config/data.source";
import { ProductEntity } from "../../product/entities/product.entity";
import { ImageEntity } from "../../image/entities/image.entity";
import { StockEntity } from "../../stock/entities/stock.entity";

export class ColorService extends BaseService<ColorEntity> {
  constructor() {
    super(ColorEntity);
  }

  async findAllColors(): Promise<ColorEntity[]> {
    return (await this.execRepository)
      .createQueryBuilder("colors")
      .where({ state: true })
      .getMany();
  }

  async findAllColorsAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[ColorEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [colors, count] = await (await this.execRepository)
      .createQueryBuilder("colors")
      .orderBy("colors.name", order)
      .skip(skipCount)
      .take(limit)
      .where({ state: true })
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [colors, count, totalPages];
  }

  async findColorById(id: string): Promise<ColorEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("color")
      .where({ id, state: true })
      .getOne();
  }

  async findColorByIdForDelete(id: string): Promise<ColorEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("color")
      .leftJoinAndSelect("color.products", "products")
      .where({ id, state: true })
      .getOne();
  }

  async findColorByName(name: string): Promise<ColorEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("color")
      .addSelect("color.name")
      .where({ name, state: true })
      .getOne();
  }

  async createColor(body: ColorDTO): Promise<ColorEntity> {
    return (await this.execRepository).save(body);
  }

  async updateColor(id: string, body: ColorDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteColor(color: ColorEntity): Promise<ColorEntity | null> {
    // Crear un query runner
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //Eliminar los productos relacionados
      const products = color.products;
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

      // Actualizar el estado del color
      color.state = false;

      const updateResult = await queryRunner.manager.save(color);

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
