import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { OrderType } from "../../shared/types/shared.types";
import { BrandEntity } from "../entities/brand.entity";
import { BrandDTO } from "../dto/brand.dto";
import { ProductService } from "../../product/services/product.service";

export class BrandService extends BaseService<BrandEntity> {
  constructor(private productService: ProductService = new ProductService()) {
    super(BrandEntity);
  }

  async findAllBrands(): Promise<BrandEntity[]> {
    return (await this.execRepository)
      .createQueryBuilder("brands")
      .where({ state: true })
      .getMany();
  }

  async findAllBrandsAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[BrandEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [brands, count] = await (await this.execRepository)
      .createQueryBuilder("brands")
      .orderBy("brands.name", order)
      .skip(skipCount)
      .take(limit)
      .where({ state: true })
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [brands, count, totalPages];
  }

  async findBrandById(id: string): Promise<BrandEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("brand")
      .where({ id, state: true })
      .getOne();
  }

  async findBrandByIdForDelete(id: string): Promise<BrandEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("brand")
      .leftJoinAndSelect("brand.products", "products")
      .where({ id, state: true })
      .getOne();
  }

  async findBrandByName(name: string): Promise<BrandEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("brand")
      .addSelect("brand.name")
      .where({ name, state: true })
      .getOne();
  }

  async createBrand(body: BrandDTO): Promise<BrandEntity> {
    body.name = body.name.toLowerCase().trim();
    return (await this.execRepository).save(body);
  }

  async updateBrand(id: string, body: BrandDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteBrand(id: string): Promise<BrandEntity | null> {
    // Obtener la marca existente
    const existingBrand = await this.findBrandByIdForDelete(id);
    if (!existingBrand) {
      return null;
    }

    // Eliminar los productos relacionados
    const products = existingBrand.products;
    for (const product of products) {
      await this.productService.deleteProductAndRelatedEntities(product.id);
    }

    // Actualizar el estado de la marca
    existingBrand.state = false;

    // Guardar los cambios en la base de datos
    const updateResult = (await this.execRepository).save(existingBrand);
    return updateResult;
  }
}
