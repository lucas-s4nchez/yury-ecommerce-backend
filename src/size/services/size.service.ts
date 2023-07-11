import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { OrderType } from "../../shared/types/shared.types";
import { SizeEntity } from "../entities/size.entity";
import { SizeDTO } from "../dto/size.dto";

export class SizeService extends BaseService<SizeEntity> {
  constructor() {
    super(SizeEntity);
  }

  async findAllSizes(): Promise<SizeEntity[]> {
    return (await this.execRepository).createQueryBuilder("sizes").getMany();
  }

  async findAllSizesAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[SizeEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [sizes, count] = await (await this.execRepository)
      .createQueryBuilder("sizes")
      .orderBy("sizes.number", order)
      .skip(skipCount)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [sizes, count, totalPages];
  }

  async findSizeById(id: string): Promise<SizeEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("size")
      .where({ id })
      .getOne();
  }

  async findSizeByNumber(number: number): Promise<SizeEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("size")
      .addSelect("size.number")
      .where({ number })
      .getOne();
  }

  async findSizeRelatedToProduct(
    sizeId: string,
    productId: string
  ): Promise<SizeEntity | null> {
    return await (await this.execRepository)
      .createQueryBuilder("size")
      .innerJoin("size.products", "product")
      .where("size.id = :sizeId", { sizeId })
      .andWhere("product.id = :productId", { productId })
      .getOne();
  }

  async createSize(body: SizeDTO): Promise<SizeEntity> {
    return (await this.execRepository).save(body);
  }

  async updateSize(id: string, body: SizeDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteSize(id: string): Promise<SizeEntity | null> {
    // Obtener el talle existente
    const existingSize = await this.findSizeById(id);
    if (!existingSize) {
      return null;
    }

    // Actualizar el estado del talle
    existingSize.state = false;

    // Guardar los cambios en la base de datos
    const updateResult = (await this.execRepository).save(existingSize);
    return updateResult;
  }
}
