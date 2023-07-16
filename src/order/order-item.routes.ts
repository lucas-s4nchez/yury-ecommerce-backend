import { BaseRouter } from "../shared/router/router";
import { OrderItemController } from "./controllers/order-item.controller";
import { OrderItemMiddleware } from "./middlewares/order-item.middleware";

export class OrderItemRoute extends BaseRouter<
  OrderItemController,
  OrderItemMiddleware
> {
  constructor() {
    super(OrderItemController, OrderItemMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de order-item
  routes(): void {
    this.router.get("/orderItems", (req, res) =>
      this.controller.getOrderItems(req, res)
    );
    this.router.get("/orderItem/:id", (req, res) =>
      this.controller.getOrderItemById(req, res)
    );
  }
}
