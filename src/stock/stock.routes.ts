import { BaseRouter } from "../shared/router/router";
import { StockController } from "./controllers/stock.controller";
import { StockMiddleware } from "./middlewares/stock.middleware";

export class StockRoute extends BaseRouter<StockController, StockMiddleware> {
  constructor() {
    super(StockController, StockMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  routes(): void {
    this.router.get(
      "/stocks",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.getStocks(req, res)
    );
    this.router.get(
      "/stocks/:id",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.getStockById(req, res)
    );
    this.router.post(
      "/stocks",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      this.middleware.stockValidator.bind(this.middleware),
      (req, res) => this.controller.createStock(req, res)
    );
    this.router.put(
      "/stocks/:id",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      this.middleware.updateStockValidator.bind(this.middleware),
      (req, res) => this.controller.updateStock(req, res)
    );
  }
}
