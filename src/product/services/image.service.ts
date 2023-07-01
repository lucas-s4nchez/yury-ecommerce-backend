import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { ProductDTO } from "../dto/product.dto";
import { ImageEntity } from "../entities/image.entity";

export class ImageService extends BaseService<ImageEntity> {
  constructor() {
    super(ImageEntity);
  }

  // async findAllProducts(): Promise<[ProductEntity[], number]> {
  //   return (await this.execRepository)
  //     .createQueryBuilder("products")
  //     .leftJoinAndSelect("products.category", "category")
  //     .getManyAndCount();
  // }
  async findAllProductImageByProductId(
    id: string
  ): Promise<ImageEntity[] | null> {
    return (await this.execRepository)
      .createQueryBuilder("product_images")
      .where("product_images.product_id = :id", { id })
      .getMany();
  }
  async createProductImage(body: any): Promise<ImageEntity> {
    return (await this.execRepository).save(body);
  }
  async deleteProduct(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
  async deleteAllProductImagesByProductId(id: string): Promise<DeleteResult> {
    return (await this.execRepository)
      .createQueryBuilder()
      .delete()
      .from(ImageEntity)
      .where("product = :productId", { productId: id })
      .execute();
  }
  async updateProduct(
    id: string,
    infoUpdate: ProductDTO
  ): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }
}
