import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { OrderType } from "../../shared/types/shared.types";
import { ColorEntity } from "../entities/color.entity";
import { ColorDTO } from "../dto/color.dto";

export class ColorService extends BaseService<ColorEntity> {
  constructor() {
    super(ColorEntity);
  }

  async findAllColors(): Promise<ColorEntity[]> {
    return (await this.execRepository).createQueryBuilder("colors").getMany();
  }

  async findAllColorsAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[ColorEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [colors, count] = await (await this.execRepository)
      .createQueryBuilder("colors")
      .orderBy("colors.name", order)
      .skip(skipCount)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [colors, count, totalPages];
  }

  async findColorById(id: string): Promise<ColorEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("color")
      .where({ id })
      .getOne();
  }

  async findColorByName(name: string): Promise<ColorEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("color")
      .addSelect("color.name")
      .where({ name })
      .getOne();
  }

  async createColor(body: ColorDTO): Promise<ColorEntity> {
    return (await this.execRepository).save(body);
  }

  async updateColor(id: string, body: ColorDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteColor(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
}
