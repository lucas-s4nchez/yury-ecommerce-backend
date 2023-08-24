import { BaseService } from "../../config/base.service";
import { ProductDTO, UpdateProductDTO } from "../dto/product.dto";
import { ProductEntity } from "../entities/product.entity";
import { OrderType } from "../../shared/types/shared.types";
import { ImageService } from "../../image/services/image.service";
import { StockService } from "../../stock/services/stock.service";
import { CartItemService } from "../../cart/services/cartItem.service";
import { AppDataSource } from "../../config/data.source";
import { ImageEntity } from "../../image/entities/image.entity";
import { StockEntity } from "../../stock/entities/stock.entity";
import { CartItemEntity } from "../../cart/entities/cartItem.entity";
import { GenderType } from "../types/Gender";

export class ProductService extends BaseService<ProductEntity> {
  constructor() {
    super(ProductEntity);
  }

  async findAllProductsAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[ProductEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [products, count] = await (
      await this.execRepository
    )
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images", "images.state = :state", {
        state: true,
      })
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .orderBy("products.name", order)
      .skip(skipCount)
      .take(limit)
      .where({ state: true })
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [products, count, totalPages];
  }

  async findAvailableProductsAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[ProductEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [products, count] = await (
      await this.execRepository
    )
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images", "images.state = :state", {
        state: true,
      })
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .orderBy("products.name", order)
      .skip(skipCount)
      .take(limit)
      .where({ state: true, available: true })
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [products, count, totalPages];
  }

  async findFeaturedProductsAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[ProductEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [products, count] = await (
      await this.execRepository
    )
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images", "images.state = :state", {
        state: true,
      })
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .orderBy("products.name", order)
      .skip(skipCount)
      .take(limit)
      .where({ state: true, available: true, featured: true })
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [products, count, totalPages];
  }

  async findProductsByParamsAndPaginate(
    page: number,
    limit: number,
    order: OrderType,
    searchParams: {
      name?: string;
      category?: string;
      featured?: boolean;
      gender?: GenderType;
      minPrice?: number;
      maxPrice?: number;
      color?: string;
      brand?: string;
      size?: number;
    }
  ): Promise<[ProductEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const queryBuilder = (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images", "images.state = :state", {
        state: true,
      })
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .orderBy("products.name", order)
      .skip(skipCount)
      .take(limit)
      .where("products.state = :state", { state: true })
      .andWhere("products.available = :available", { available: true });

    if (searchParams.name) {
      queryBuilder.andWhere("products.name LIKE :name", {
        name: `%${searchParams.name}%`,
      });
    }

    if (searchParams.category) {
      queryBuilder.andWhere("category.name = :category", {
        category: searchParams.category,
      });
    }

    if (searchParams.featured) {
      queryBuilder.andWhere("products.featured = :featured", {
        featured: true,
      });
    }

    if (searchParams.gender) {
      queryBuilder.andWhere("products.gender = :gender", {
        gender: searchParams.gender,
      });
    }

    if (searchParams.minPrice !== undefined) {
      queryBuilder.andWhere("products.price >= :minPrice", {
        minPrice: searchParams.minPrice,
      });
    }

    if (searchParams.maxPrice !== undefined) {
      queryBuilder.andWhere("products.price <= :maxPrice", {
        maxPrice: searchParams.maxPrice,
      });
    }

    if (searchParams.color) {
      queryBuilder.andWhere("colors.name = :color", {
        color: searchParams.color,
      });
    }

    if (searchParams.brand) {
      queryBuilder.andWhere("brand.name = :brand", {
        brand: searchParams.brand,
      });
    }

    if (searchParams.size) {
      queryBuilder.andWhere("sizes.number = :size", {
        size: searchParams.size,
      });
    }
    const [products, count] = await queryBuilder
      .orderBy("products.name", order)
      .skip(skipCount)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [products, count, totalPages];
  }

  async findProductById(id: string): Promise<ProductEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images", "images.state = :state", {
        state: true,
      })
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .where({ id, state: true })
      .getOne();
  }

  async findAvailableProductById(id: string): Promise<ProductEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images", "images.state = :state", {
        state: true,
      })
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .where({ id, state: true, available: true })
      .getOne();
  }

  async findProductByIdForDelete(id: string): Promise<ProductEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.images", "images", "images.state = :state", {
        state: true,
      })
      .leftJoinAndSelect("product.stock", "stock")
      .leftJoinAndSelect("product.sizes", "sizes")
      .leftJoinAndSelect("product.colors", "colors")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.cartItems", "cartItems")
      .leftJoinAndSelect("product.favorites", "favorites")
      .where({ id, state: true })
      .getOne();
  }

  async findProductByName(name: string): Promise<ProductEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images", "images.state = :state", {
        state: true,
      })
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .where({ name, state: true })
      .getOne();
  }

  async createProduct(body: ProductDTO): Promise<ProductEntity> {
    return (await this.execRepository).save(body);
  }

  async updateProduct(
    id: string,
    infoUpdate: UpdateProductDTO
  ): Promise<ProductEntity> {
    // Obtener el producto existente
    const existingProduct = await this.findProductById(id);
    if (!existingProduct) {
      throw new Error("Producto no encontrado");
    }

    // Actualizar las propiedades directas del producto
    existingProduct.name = infoUpdate.name;
    existingProduct.description = infoUpdate.description;
    existingProduct.price = infoUpdate.price;
    existingProduct.featured = infoUpdate.featured || existingProduct.featured;
    existingProduct.category = infoUpdate.category;
    existingProduct.brand = infoUpdate.brand;
    // Actualizar la relación `sizes`
    existingProduct.sizes = infoUpdate.sizes;
    // Actualizar la relación `colors`
    existingProduct.colors = infoUpdate.colors;

    // Guardar los cambios en la base de datos
    const updateResult = (await this.execRepository).save(existingProduct);
    return updateResult;
  }

  async productIsAvailable(
    id: string,
    isAvailable: boolean
  ): Promise<ProductEntity | null> {
    // Obtener el producto existente
    const existingProduct = await this.findProductByIdForDelete(id);
    if (!existingProduct) {
      return null;
    }
    // Iniciar un query runner
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Actualizar la propiedad "available" del producto
      existingProduct.available = isAvailable;

      // Si isAvailable es "false", eliminar los cartItems relacionados al producto
      if (!isAvailable) {
        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(CartItemEntity)
          .where("product = :productId", { productId: existingProduct.id })
          .execute();
      }

      // Guardar los cambios en la base de datos
      const updateResult = await queryRunner.manager.save(existingProduct);

      // Commit de la transacción
      await queryRunner.commitTransaction();

      return updateResult;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProductAndRelatedEntities(
    id: string
  ): Promise<ProductEntity | null> {
    // Obtener el producto existente
    const existingProduct = await this.findProductByIdForDelete(id);
    if (!existingProduct) {
      return null;
    }

    // Crear un query runner
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Eliminar las imágenes relacionadas
      const images = existingProduct.images;
      for (const image of images) {
        const existingImage = await queryRunner.manager.findOneBy(ImageEntity, {
          id: image.id,
        });
        if (existingImage) {
          existingImage.state = false;
          await queryRunner.manager.save(existingImage);
        }
      }

      // Eliminar el stock relacionado
      const stock = existingProduct.stock;
      if (stock) {
        const existingStock = await queryRunner.manager.findOneBy(StockEntity, {
          id: stock.id,
        });
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

      // Guardar los cambios en la base de datos
      const updateResult = await queryRunner.manager.save(existingProduct);
      // Commit de la transacción
      await queryRunner.commitTransaction();

      return updateResult;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }
}
