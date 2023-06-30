import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { ProductDTO } from "../dto/product.dto";
import { ProductEntity } from "../entities/product.entity";
import { ProductImageEntity } from "../entities/product-image.entity";
import { ProductImageDTO } from "../dto/product-image.dto";

export class ProductImageService extends BaseService<ProductImageEntity> {
  constructor() {
    super(ProductImageEntity);
  }

  // async findAllProducts(): Promise<[ProductEntity[], number]> {
  //   return (await this.execRepository)
  //     .createQueryBuilder("products")
  //     .leftJoinAndSelect("products.category", "category")
  //     .getManyAndCount();
  // }
  async findAllProductImageByProductId(
    id: string
  ): Promise<ProductImageEntity[] | null> {
    return (await this.execRepository)
      .createQueryBuilder("product_images")
      .where("product_images.product_id = :id", { id })
      .getMany();
  }
  async createProductImage(body: any): Promise<ProductImageEntity> {
    return (await this.execRepository).save(body);
  }
  async deleteProduct(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
  async deleteAllProductImagesByProductId(id: string): Promise<DeleteResult> {
    return (await this.execRepository)
      .createQueryBuilder()
      .delete()
      .from(ProductImageEntity)
      .where({ product_id: id })
      .execute();
  }
  async updateProduct(
    id: string,
    infoUpdate: ProductDTO
  ): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }
}
