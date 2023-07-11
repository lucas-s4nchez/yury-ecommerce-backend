import { BaseService } from "../../config/base.service";
import { ProductDTO, UpdateProductDTO } from "../dto/product.dto";
import { ProductEntity } from "../entities/product.entity";
import { OrderType } from "../../shared/types/shared.types";

export class ProductService extends BaseService<ProductEntity> {
  constructor() {
    super(ProductEntity);
  }

  async findAllProductsAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[ProductEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [products, count] = await (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images")
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .orderBy("products.name", order)
      .skip(skipCount)
      .take(limit)
      .where({ state: true })
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [products, count, totalPages];
  }

  async findAvailableProductsAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[ProductEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [products, count] = await (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images")
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .orderBy("products.name", order)
      .skip(skipCount)
      .take(limit)
      .where({ state: true, available: true })
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [products, count, totalPages];
  }

  async findProductById(id: string): Promise<ProductEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images")
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .where({ id, state: true })
      .getOne();
  }

  async findAvailableProductById(id: string): Promise<ProductEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images")
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .where({ id, state: true, available: true })
      .getOne();
  }

  async findProductByIdForDelete(id: string): Promise<ProductEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.images", "images")
      .leftJoinAndSelect("product.stock", "stock")
      .leftJoinAndSelect("product.sizes", "sizes")
      .leftJoinAndSelect("product.colors", "colors")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.cartItems", "cartItems")
      .where({ id, state: true })
      .getOne();
  }

  async findProductByName(name: string): Promise<ProductEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.images", "images")
      .leftJoinAndSelect("products.stock", "stock")
      .leftJoinAndSelect("products.sizes", "sizes")
      .leftJoinAndSelect("products.colors", "colors")
      .leftJoinAndSelect("products.brand", "brand")
      .where({ name, state: true })
      .getOne();
  }

  async createProduct(body: ProductDTO): Promise<ProductEntity> {
    return (await this.execRepository).save(body);
  }

  async updateProduct(
    id: string,
    infoUpdate: UpdateProductDTO
  ): Promise<ProductEntity> {
    // Obtener el producto existente
    const existingProduct = await this.findProductById(id);
    if (!existingProduct) {
      throw new Error("Producto no encontrado");
    }

    // Actualizar las propiedades directas del producto
    existingProduct.name = infoUpdate.name;
    existingProduct.description = infoUpdate.description;
    existingProduct.price = infoUpdate.price;
    existingProduct.featured = infoUpdate.featured || existingProduct.featured;
    existingProduct.category = infoUpdate.category;
    existingProduct.brand = infoUpdate.brand;
    // Actualizar la relación `sizes`
    existingProduct.sizes = infoUpdate.sizes;
    // Actualizar la relación `colors`
    existingProduct.colors = infoUpdate.colors;

    // Guardar los cambios en la base de datos
    const updateResult = (await this.execRepository).save(existingProduct);
    return updateResult;
  }

  async productIsAvailable(
    id: string,
    isAvailable: boolean
  ): Promise<ProductEntity> {
    // Obtener el producto existente
    const existingProduct = await this.findProductById(id);
    if (!existingProduct) {
      throw new Error("Producto no encontrado");
    }

    // Actualizar la propiedad "available" del producto
    existingProduct.available = isAvailable;

    // Guardar los cambios en la base de datos
    const updateResult = (await this.execRepository).save(existingProduct);
    return updateResult;
  }

  async deleteProduct(id: string): Promise<ProductEntity | null> {
    // Obtener el producto existente
    const existingProduct = await this.findProductByIdForDelete(id);
    if (!existingProduct) {
      return null;
    }

    // Actualizar el estado del producto
    existingProduct.state = false;

    // Guardar los cambios en la base de datos
    const updateResult = (await this.execRepository).save(existingProduct);
    return updateResult;
  }
}
