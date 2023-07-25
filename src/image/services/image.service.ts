import { DeleteResult, QueryRunner, UpdateResult } from "typeorm";
import { ProductDTO } from "../../product/dto/product.dto";
import { ImageEntity } from "../entities/image.entity";
import { BaseService } from "../../config/base.service";
import { ImageDTO } from "../dto/image.dto";

export class ImageService extends BaseService<ImageEntity> {
  constructor() {
    super(ImageEntity);
  }

  async findImagesByProductId(id: string): Promise<ImageEntity[]> {
    return (await this.execRepository)
      .createQueryBuilder("images")
      .leftJoin("images.product", "product")
      .where({ state: true })
      .andWhere("product.id = :id", { id })
      .getMany();
  }

  async findImagesById(id: string): Promise<ImageEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("product_images")
      .where({ id, state: true })
      .getOne();
  }

  async createImage(body: ImageDTO): Promise<ImageEntity> {
    return (await this.execRepository).save(body);
  }

  async deleteImage(image: ImageEntity): Promise<ImageEntity | null> {
    try {
      // Actualizar el estado de la imagen
      image.state = false;

      // Guardar los cambios en la base de datos
      const updateResult = (await this.execRepository).save(image);

      return updateResult;
    } catch (error) {
      return null;
    }
  }
}
