import { DeleteResult, UpdateResult } from "typeorm";
import { ProductDTO } from "../../product/dto/product.dto";
import { ImageEntity } from "../entities/image.entity";
import { BaseService } from "../../config/base.service";

export class ImageService extends BaseService<ImageEntity> {
  constructor() {
    super(ImageEntity);
  }

  async findImagesByProductId(id: string): Promise<ImageEntity[]> {
    return (await this.execRepository)
      .createQueryBuilder("images")
      .leftJoin("images.product", "product")
      .where("product.id = :id", { id })
      .getMany();
  }
  async findImagesById(id: string): Promise<ImageEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("product_images")
      .where({ id })
      .getOne();
  }

  async createImage(body: any): Promise<ImageEntity> {
    return (await this.execRepository).save(body);
  }

  async deleteImage(id: string): Promise<ImageEntity | null> {
    // Obtener la imagen existente
    const existingImage = await this.findImagesById(id);
    if (!existingImage) {
      return null;
    }

    // Actualizar el estado de la imagen
    existingImage.state = false;

    // Guardar los cambios en la base de datos
    const updateResult = (await this.execRepository).save(existingImage);
    return updateResult;
  }

  async deleteAllImagesByProductId(id: string): Promise<DeleteResult> {
    return (await this.execRepository)
      .createQueryBuilder()
      .delete()
      .from(ImageEntity)
      .where("product = :productId", { productId: id })
      .execute();
  }
  async updateImage(id: string, infoUpdate: ProductDTO): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }
}
