import { BaseRouter } from "../shared/router/router";
import { OrderController } from "./controllers/order.controller";
import { OrderMiddleware } from "./middlewares/order.middleware";

export class OrderRoute extends BaseRouter<OrderController, OrderMiddleware> {
  constructor() {
    super(OrderController, OrderMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de order
  routes(): void {
    this.router.get(
      "/orders",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.getAllOrders(req, res)
    );
    this.router.get(
      "/orders/myOrders",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.getOrdersByUserId(req, res)
    );
    this.router.get(
      "/orders/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.getOrderById(req, res)
    );
    this.router.post("/orders", this.middleware.checkJsonWebToken, (req, res) =>
      this.controller.createOrder(req, res)
    );
    this.router.put(
      "/cancelOrder/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.cancelOrder(req, res)
    );
    this.router.put(
      "/completeOrder/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.completeOrder(req, res)
    );
  }
}
