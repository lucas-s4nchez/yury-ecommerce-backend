import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { OrderType } from "../../shared/types/shared.types";
import { SizeEntity } from "../entities/size.entity";
import { SizeDTO } from "../dto/size.dto";
import { ProductService } from "../../product/services/product.service";
import { AppDataSource } from "../../config/data.source";
import { ProductEntity } from "../../product/entities/product.entity";
import { ImageEntity } from "../../image/entities/image.entity";
import { StockEntity } from "../../stock/entities/stock.entity";

export class SizeService extends BaseService<SizeEntity> {
  constructor(private productService: ProductService = new ProductService()) {
    super(SizeEntity);
  }

  async findAllSizes(): Promise<SizeEntity[]> {
    return (await this.execRepository)
      .createQueryBuilder("sizes")
      .where({ state: true })
      .getMany();
  }

  async findAllSizesAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[SizeEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [sizes, count] = await (await this.execRepository)
      .createQueryBuilder("sizes")
      .orderBy("sizes.number", order)
      .skip(skipCount)
      .take(limit)
      .where({ state: true })
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [sizes, count, totalPages];
  }

  async findSizeById(id: string): Promise<SizeEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("size")
      .where({ id, state: true })
      .getOne();
  }

  async findSizeByIdForDelete(id: string): Promise<SizeEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("size")
      .leftJoinAndSelect("size.products", "products")
      .where({ id, state: true })
      .getOne();
  }

  async findSizeByNumber(number: number): Promise<SizeEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("size")
      .addSelect("size.number")
      .where({ number, state: true })
      .getOne();
  }

  async findSizeRelatedToProduct(
    sizeId: string,
    productId: string
  ): Promise<SizeEntity | null> {
    return await (await this.execRepository)
      .createQueryBuilder("size")
      .innerJoin("size.products", "product")
      .where("size.id = :sizeId", { sizeId, state: true })
      .andWhere("product.id = :productId", { productId, state: true })
      .getOne();
  }

  async createSize(body: SizeDTO): Promise<SizeEntity> {
    return (await this.execRepository).save(body);
  }

  async updateSize(id: string, body: SizeDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteSize(size: SizeEntity): Promise<SizeEntity | null> {
    // Crear un query runner
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //Eliminar los productos relacionados
      const products = size.products;
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

      // Actualizar el estado del talle
      size.state = false;

      const updateResult = await queryRunner.manager.save(size);

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
    // // Obtener el talle existente
    // const existingSize = await this.findSizeByIdForDelete(id);
    // if (!existingSize) {
    //   return null;
    // }

    // // Eliminar los productos relacionados
    // const products = existingSize.products;
    // for (const product of products) {
    //   await this.productService.deleteProductAndRelatedEntities(product.id);
    // }

    // // Actualizar el estado del talle
    // existingSize.state = false;

    // // Guardar los cambios en la base de datos
    // const updateResult = (await this.execRepository).save(existingSize);
    // return updateResult;
  }
}
