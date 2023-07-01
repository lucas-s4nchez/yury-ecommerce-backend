import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { OrderType } from "../../shared/types/shared.types";
import { BrandEntity } from "../entities/brand.entity";
import { BrandDTO } from "../dto/brand.dto";

export class BrandService extends BaseService<BrandEntity> {
  constructor() {
    super(BrandEntity);
  }

  async findAllBrands(
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
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [brands, count, totalPages];
  }

  async findBrandById(id: string): Promise<BrandEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("brand")
      .where({ id })
      .getOne();
  }

  async findBrandByName(name: string): Promise<BrandEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("brand")
      .addSelect("brand.name")
      .where({ name })
      .getOne();
  }

  async createBrand(body: BrandDTO): Promise<BrandEntity> {
    return (await this.execRepository).save(body);
  }

  async updateBrand(id: string, body: BrandDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteBrand(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
}
