import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { ImageService } from "../services/image.service";
import { UploadedFile } from "express-fileupload";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "../helpers/cloudinary.helper";
import { ImageDTO } from "../dto/image.dto";
import { ProductService } from "../../product/services/product.service";
import { validate } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { plainToClass } from "class-transformer";
import { ImageEntity } from "../entities/image.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { DeleteResult } from "typeorm";

export class ImageController {
  constructor(
    private readonly imageService: ImageService = new ImageService(),
    private readonly productService: ProductService = new ProductService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getImages(req: Request, res: Response) {
    const { productId } = req.params;
    try {
      const data = await this.imageService.findImagesByProductId(productId);

      if (data.length === 0) {
        return this.httpResponse.NotFound(
          res,
          "No hay imagenes para este producto"
        );
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getImageById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.imageService.findImagesByProductId(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe esta imagen");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async createImage(req: Request, res: Response) {
    const { productId } = req.params;
    const { tempFilePath } = req.files?.file as UploadedFile;

    try {
      //verificar que exista este producto
      const product = await this.productService.findProductById(productId);
      if (!product) {
        return this.httpResponse.BadRequest(res, [
          {
            property: "product",
            errors: [`No existe este producto`],
          },
        ]);
      }
      if (product.images.length >= 4) {
        return this.httpResponse.BadRequest(
          res,
          "El producto tiene un máximo de 4 imágenes permitidas"
        );
      }
      //Subir la imagen a cloudinary
      const { secure_url, public_id } = await uploadImageToCloudinary(
        tempFilePath,
        `yury-ecommerce/products`
      );
      //Crear una instancia de imageDTO, con la informacion de cloudinary + el producto asociado
      const imageDTO = new ImageDTO();
      (imageDTO.url = secure_url),
        (imageDTO.public_id = public_id),
        (imageDTO.product = plainToClass(ProductEntity, product));

      // Crear la entidad de imagen en la base de datos
      const data = await this.imageService.createImage(imageDTO);
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteImage(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const image = await this.imageService.findImagesById(id);
      //Eiminar de base de datos
      const data: DeleteResult = await this.imageService.deleteImage(id);
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }

      if (image) {
        // Eliminar imagen en Cloudinary
        await deleteImageFromCloudinary(image.public_id);
      }
      return this.httpResponse.Ok(res, "Imagen eliminada correctamente");
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
}
