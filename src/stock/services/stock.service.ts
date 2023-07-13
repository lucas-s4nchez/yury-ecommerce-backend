import { UpdateResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { OrderType } from "../../shared/types/shared.types";
import { StockEntity } from "../entities/stock.entity";
import { StockDTO, UpdateStockDTO } from "../dto/stock.dto";

export class StockService extends BaseService<StockEntity> {
  constructor() {
    super(StockEntity);
  }

  async findAllStocks(): Promise<StockEntity[]> {
    return (await this.execRepository)
      .createQueryBuilder("stocks")
      .leftJoinAndSelect("stocks.product", "product")
      .getMany();
  }

  async findAllStocksAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[StockEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [stocks, count] = await (await this.execRepository)
      .createQueryBuilder("stocks")
      .leftJoinAndSelect("stocks.product", "product")
      .orderBy("stocks.quantity", order)
      .skip(skipCount)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [stocks, count, totalPages];
  }

  async findStockById(id: string): Promise<StockEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("stock")
      .where({ id })
      .getOne();
  }

  async findStockByProduct(product: string): Promise<StockEntity | null> {
    const stock = await (await this.execRepository)
      .createQueryBuilder("stock")
      .where("stock.product_id = :productId", { productId: product })
      .getOne();
    return stock || null;
  }

  async createStock(body: StockDTO): Promise<StockEntity> {
    return (await this.execRepository).save(body);
  }

  async updateStock(id: string, body: UpdateStockDTO): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteStock(id: string): Promise<StockEntity | null> {
    // Obtener el talle existente
    const existingStock = await this.findStockById(id);
    if (!existingStock) {
      return null;
    }

    // Actualizar el estado del talle
    existingStock.state = false;

    // Guardar los cambios en la base de datos
    const updateResult = (await this.execRepository).save(existingStock);
    return updateResult;
  }
}
