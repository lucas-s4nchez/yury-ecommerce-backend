import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { ProductDTO } from "../dto/product.dto";
import { ProductEntity } from "../entities/product.entity";

export class ProductService extends BaseService<ProductEntity> {
  constructor() {
    super(ProductEntity);
  }

  async findAllProducts(): Promise<[ProductEntity[], number]> {
    return (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images")
      .leftJoinAndSelect("products.stock", "stock")
      .getManyAndCount();
  }
  async findProductById(id: string): Promise<ProductEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images")
      .leftJoinAndSelect("products.stock", "stock")
      .where({ id })
      .getOne();
  }

  async findProductByName(name: string): Promise<ProductEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("products")
      .where({ name })
      .getOne();
  }

  async createProduct(body: ProductDTO): Promise<ProductEntity> {
    return (await this.execRepository).save(body);
  }
  async deleteProduct(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
  async updateProduct(
    id: string,
    infoUpdate: ProductDTO
  ): Promise<UpdateResult> {
    return await (await this.execRepository).update(id, infoUpdate);
  }
}
