import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { OrderType } from "../../shared/types/shared.types";
import { ColorEntity } from "../entities/color.entity";
import { ColorDTO } from "../dto/color.dto";
import { ProductService } from "../../product/services/product.service";

export class ColorService extends BaseService<ColorEntity> {
  constructor(private productService: ProductService = new ProductService()) {
    super(ColorEntity);
  }

  async findAllColors(): Promise<ColorEntity[]> {
    return (await this.execRepository)
      .createQueryBuilder("colors")
      .where({ state: true })
      .getMany();
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
      .where({ state: true })
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [colors, count, totalPages];
  }

  async findColorById(id: string): Promise<ColorEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("color")
      .where({ id, state: true })
      .getOne();
  }

  async findColorByIdForDelete(id: string): Promise<ColorEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("color")
      .leftJoinAndSelect("color.products", "products")
      .where({ id, state: true })
      .getOne();
  }

  async findColorByName(name: string): Promise<ColorEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("color")
      .addSelect("color.name")
      .where({ name, state: true })
      .getOne();
  }

  async createColor(body: ColorDTO): Promise<ColorEntity> {
    return (await this.execRepository).save(body);
  }

  async updateColor(id: string, body: ColorDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteColor(id: string): Promise<ColorEntity | null> {
    // Obtener el producto existente
    const existingColor = await this.findColorByIdForDelete(id);
    if (!existingColor) {
      return null;
    }

    // Eliminar los productos relacionados relacionadas
    const products = existingColor.products;
    for (const product of products) {
      await this.productService.deleteProductAndRelatedEntities(product.id);
    }

    // Actualizar el estado de la categoria
    existingColor.state = false;

    // Guardar los cambios en la base de datos
    const updateResult = (await this.execRepository).save(existingColor);
    return updateResult;
    // return (await this.execRepository).delete({ id });
  }
}
