import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { DeleteResult, UpdateResult } from "typeorm";
import { ProductService } from "../services/product.service";

export class ProductController {
  constructor(
    private readonly productService: ProductService = new ProductService(),
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
    const productData = req.body;
    try {
      const data = await this.productService.createProduct(productData);
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const productData = req.body;
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
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: DeleteResult = await this.productService.deleteProduct(id);
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
}
