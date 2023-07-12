import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { ProductService } from "../services/product.service";
import { OrderType } from "../../shared/types/shared.types";

export class ProductController {
  constructor(
    private readonly productService: ProductService = new ProductService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getAllProducts(req: Request, res: Response) {
    try {
      let { page = 1, limit = 8, order = OrderType.ASC as any } = req.query;
      let pageNumber = parseInt(page as string, 10);
      let limitNumber = parseInt(limit as string, 10);

      // Validar si los valores son numéricos y mayores a 0
      if (isNaN(pageNumber) || pageNumber <= 0) {
        pageNumber = 1; // Valor predeterminado si no es un número válido
      }
      if (isNaN(limitNumber) || limitNumber <= 0) {
        limitNumber = 8; // Valor predeterminado si no es un número válido
      }

      // Validar el valor de order
      if (!(order in OrderType)) {
        order = OrderType.ASC; // Valor predeterminado si no es válido
      }

      const data = await this.productService.findAllProductsAndPaginate(
        pageNumber,
        limitNumber,
        order
      );

      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay productos");
      }
      const [products, count, totalPages] = data;
      return this.httpResponse.Ok(res, { products, count, totalPages });
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.productService.findProductById(id);
      if (!data) {
        return this.httpResponse.NotFound(
          res,
          "No existe este producto o no está disponible"
        );
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getAvailableProducts(req: Request, res: Response) {
    try {
      let { page = 1, limit = 8, order = OrderType.ASC as any } = req.query;
      let pageNumber = parseInt(page as string, 10);
      let limitNumber = parseInt(limit as string, 10);

      // Validar si los valores son numéricos y mayores a 0
      if (isNaN(pageNumber) || pageNumber <= 0) {
        pageNumber = 1; // Valor predeterminado si no es un número válido
      }
      if (isNaN(limitNumber) || limitNumber <= 0) {
        limitNumber = 8; // Valor predeterminado si no es un número válido
      }

      // Validar el valor de order
      if (!(order in OrderType)) {
        order = OrderType.ASC; // Valor predeterminado si no es válido
      }

      const data = await this.productService.findAvailableProductsAndPaginate(
        pageNumber,
        limitNumber,
        order
      );

      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay productos");
      }
      const [products, count, totalPages] = data;
      return this.httpResponse.Ok(res, { products, count, totalPages });
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async getAvailableProductById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.productService.findAvailableProductById(id);
      if (!data) {
        return this.httpResponse.NotFound(
          res,
          "No existe este producto o no está disponible"
        );
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async createProduct(req: Request, res: Response) {
    const { available, state, ...productData } = req.body;

    try {
      const data = await this.productService.createProduct(productData);

      return this.httpResponse.Ok(res, "Producto creado correctamente");
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async productIsAvailable(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const existingProduct = await this.productService.findProductById(id);
      if (!existingProduct) {
        return this.httpResponse.NotFound(res, "Producto no encontrado");
      }

      if (!existingProduct.stock) {
        return this.httpResponse.BadRequest(
          res,
          "El producto debe tener 'stock' registrado"
        );
      }
      if (!existingProduct.images.length) {
        return this.httpResponse.BadRequest(
          res,
          `El producto debe al menos una imagen`
        );
      }
      const data = await this.productService.productIsAvailable(id, true);
      if (!data) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, "Producto actualizado correctamente");
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async productIsNotAvailable(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const existingProduct = await this.productService.findProductById(id);
      if (!existingProduct) {
        return this.httpResponse.NotFound(res, "Producto no encontrado");
      }

      const data = await this.productService.productIsAvailable(id, false);
      if (!data) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, "Producto actualizado correctamente");
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const { available, state, ...productData } = req.body;
    try {
      const existingProduct = await this.productService.findProductById(id);
      if (!existingProduct) {
        return this.httpResponse.NotFound(res, "Producto no encontrado");
      }

      // Verificar y actualizar el nombre del producto si es diferente
      if (productData.name !== existingProduct.name) {
        const isNameTaken = await this.productService.findProductByName(
          productData.name
        );
        if (isNameTaken) {
          return this.httpResponse.BadRequest(res, [
            {
              property: "name",
              errors: [`El producto '${productData.name}' ya está registrado`],
            },
          ]);
        }
      }
      const data = await this.productService.updateProduct(id, productData);
      if (!data) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, "Producto actualizado correctamente");
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      //Verificar si existe el producto
      const existingProduct = await this.productService.findProductById(id);
      if (!existingProduct) {
        return this.httpResponse.NotFound(res, "Producto no encontrado");
      }
      // Eliminar el producto y las entidades relacionadas
      const deletedProduct =
        await this.productService.deleteProductAndRelatedEntities(id);
      if (!deletedProduct) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }

      return this.httpResponse.Ok(res, "Producto eliminado correctamente");
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
