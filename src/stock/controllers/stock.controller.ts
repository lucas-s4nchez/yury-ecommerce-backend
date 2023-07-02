import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { OrderType } from "../../shared/types/shared.types";
import { DeleteResult, UpdateResult } from "typeorm";
import { StockService } from "../services/stock.service";

export class StockController {
  constructor(
    private readonly stockService: StockService = new StockService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async stockList(req: Request, res: Response) {
    try {
      const data = await this.stockService.findAllStocks();

      if (data.length === 0) {
        return this.httpResponse.NotFound(res, "No hay stocks");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async getStocks(req: Request, res: Response) {
    try {
      let { page = 1, limit = 5, order = OrderType.ASC as any } = req.query;
      let pageNumber = parseInt(page as string, 10);
      let limitNumber = parseInt(limit as string, 10);

      // Validar si los valores son numéricos y mayores a 0
      if (isNaN(pageNumber) || pageNumber <= 0) {
        pageNumber = 1; // Valor predeterminado si no es un número válido
      }
      if (isNaN(limitNumber) || limitNumber <= 0) {
        limitNumber = 5; // Valor predeterminado si no es un número válido
      }

      // Validar el valor de order
      if (!(order in OrderType)) {
        order = OrderType.ASC; // Valor predeterminado si no es válido
      }

      const data = await this.stockService.findAllStocksAndPaginate(
        pageNumber,
        limitNumber,
        order
      );
      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay stocks");
      }
      const [stocks, count, totalPages] = data;
      return this.httpResponse.Ok(res, { stocks, count, totalPages });
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async getStockById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.stockService.findStockById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe este stock");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async createStock(req: Request, res: Response) {
    const stockData = req.body;

    try {
      const data = await this.stockService.createStock(stockData);
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async updateStock(req: Request, res: Response) {
    const { id } = req.params;
    const { product, ...stockData } = req.body;

    try {
      const data: UpdateResult = await this.stockService.updateStock(
        id,
        stockData
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

  async deleteStock(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: DeleteResult = await this.stockService.deleteStock(id);
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }

      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
