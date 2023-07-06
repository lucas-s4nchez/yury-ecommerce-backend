import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { DeleteResult, UpdateResult } from "typeorm";
import { ProductService } from "../services/product.service";
import { deleteImageFromCloudinary } from "../helpers/cloudinary.helper";
import { ImageService } from "../services/image.service";

export class ProductController {
  constructor(
    private readonly productService: ProductService = new ProductService(),
    private readonly productImageService: ImageService = new ImageService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getProducts(req: Request, res: Response) {
    try {
      const data = await this.productService.findAllProducts();

      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay productos");
      }

      const [products, count] = data;
      return this.httpResponse.Ok(res, { products, count });
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.productService.findProductById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe este producto");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async createProduct(req: Request, res: Response) {
    const { files, ...productData } = req.body;

    try {
      const data = await this.productService.createProduct(productData);

      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const { files, ...productData } = req.body;
    try {
      const data: UpdateResult = await this.productService.updateProduct(
        id,
        productData
      );
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      // Obtener todas las imágenes del producto
      const images =
        await this.productImageService.findAllProductImageByProductId(id);
      if (images && images?.length !== 0) {
        // Eliminar cada imagen en Cloudinary
        for (const image of images) {
          await deleteImageFromCloudinary(image.public_id);
        }
      }

      // Eliminar el producto
      const deleteResult: DeleteResult =
        await this.productService.deleteProduct(id);
      if (!deleteResult.affected) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }

      return this.httpResponse.Ok(res, deleteResult);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
