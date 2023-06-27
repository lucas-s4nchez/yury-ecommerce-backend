import { BaseRouter } from "../shared/router/router";
import { OrderItemController } from "./controllers/order-item.controller";

export class OrderItemRoute extends BaseRouter<OrderItemController> {
  constructor() {
    super(OrderItemController); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de order-item
  routes(): void {
    this.router.get("/orderItems", (req, res) =>
      this.controller.getOrderItems(req, res)
    );
    this.router.get("/orderItem/:id", (req, res) =>
      this.controller.getOrderItemById(req, res)
    );
    this.router.post("/createOrderItem", (req, res) =>
      this.controller.createOrderItem(req, res)
    );
    this.router.put("/updateOrderItem/:id", (req, res) =>
      this.controller.updateOrderItem(req, res)
    );
    this.router.delete("/deleteOrderItem/:id", (req, res) =>
      this.controller.deleteOrderItem(req, res)
    );
  }
}
