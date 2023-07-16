import { BaseRouter } from "../shared/router/router";
import { OrderController } from "./controllers/order.controller";
import { OrderMiddleware } from "./middlewares/order.middleware";

export class OrderRoute extends BaseRouter<OrderController, OrderMiddleware> {
  constructor() {
    super(OrderController, OrderMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de order
  routes(): void {
    this.router.get("/orders", (req, res) =>
      this.controller.getOrders(req, res)
    );
    this.router.get("/order/:id", (req, res) =>
      this.controller.getOrderById(req, res)
    );
    this.router.post(
      "/createOrder",
      this.middleware.checkJsonWebToken,
      // this.middleware.orderValidator.bind(this.middleware),
      (req, res) => this.controller.createOrder(req, res)
    );
    this.router.put("/updateOrder/:id", (req, res) =>
      this.controller.updateOrder(req, res)
    );
    this.router.delete("/deleteOrder/:id", (req, res) =>
      this.controller.deleteOrder(req, res)
    );
  }
}
