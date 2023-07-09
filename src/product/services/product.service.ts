import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { ProductDTO, UpdateProductDTO } from "../dto/product.dto";
import { ProductEntity } from "../entities/product.entity";
import { OrderType } from "../../shared/types/shared.types";

export class ProductService extends BaseService<ProductEntity> {
  constructor() {
    super(ProductEntity);
  }

  async findAllProducts(): Promise<ProductEntity[]> {
    return (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images")
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .getMany();
  }

  async findAllProductsAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[ProductEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [products, count] = await (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images")
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
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
      .leftJoinAndSelect("products.images", "images")
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .where({ id })
      .getOne();
  }

  async findProductByName(name: string): Promise<ProductEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images")
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .where({ name })
      .getOne();
  }

  async getImageCount(productId: string): Promise<number> {
    const query = await (await this.execRepository)
      .createQueryBuilder("product")
      .leftJoin("product.images", "images")
      .where("product.id = :productId", { productId })
      .select("COUNT(images.id)", "count")
      .getRawOne();

    return parseInt(query.count, 10) || 0;
  }

  async createProduct(body: ProductDTO): Promise<ProductEntity> {
    return (await this.execRepository).save(body);
  }
  async deleteProduct(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
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
    // return await (await this.execRepository).update(id, infoUpdate);
  }
}
