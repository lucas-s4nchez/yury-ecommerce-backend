import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { ImageService } from "../services/image.service";
import { UploadedFile } from "express-fileupload";
import { uploadImageToCloudinary } from "../helpers/cloudinary.helper";
import { ImageDTO } from "../dto/image.dto";
import { ProductService } from "../../product/services/product.service";
import { plainToClass } from "class-transformer";
import { ProductEntity } from "../../product/entities/product.entity";

export class ImageController {
  constructor(
    private readonly imageService: ImageService = new ImageService(),
    private readonly productService: ProductService = new ProductService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getImages(req: Request, res: Response) {
    const { productId } = req.params;
    try {
      const existingProduct = await this.productService.findProductById(
        productId
      );
      if (!existingProduct) {
        return this.httpResponse.NotFound(res, "Producto no encontrado");
      }

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
        return this.httpResponse.BadRequest(res, "Producto no encontrado");
      }
      //Imagenes activas del producto
      const productImages = product.images.filter(
        (image) => image.state === true
      );
      if (productImages.length >= 4) {
        return this.httpResponse.BadRequest(
          res,
          "Los productos tienen un máximo de 4 imágenes permitidas"
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
    const { productId, imageId } = req.params;

    try {
      const existingProduct = await this.productService.findProductById(
        productId
      );
      if (!existingProduct) {
        return this.httpResponse.NotFound(res, "Producto no encontrado");
      }
      //Imagenes activas del producto
      const productImages = existingProduct.images.filter(
        (image) => image.state === true
      );

      const existingImage = await this.imageService.findImagesById(imageId);
      if (!existingImage) {
        return this.httpResponse.NotFound(res, "Imagen no encontrada");
      }

      if (productImages.length <= 1) {
        return this.httpResponse.BadRequest(
          res,
          "No puedes eliminar todas las imágenes de un producto, debe tener al menos 1"
        );
      }

      //Eliminar de base de datos
      const deletedImage = await this.imageService.deleteImage(existingImage);
      if (!deletedImage) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }

      return this.httpResponse.Ok(res, "Imagen eliminada correctamente");
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
}
