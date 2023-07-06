import { BaseRouter } from "../shared/router/router";
import { CartController } from "./controllers/cart.controller";
import { CartMiddleware } from "./middlewares/cart.middleware";

export class CartRoute extends BaseRouter<CartController, CartMiddleware> {
  constructor() {
    super(CartController, CartMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  routes(): void {
    this.router.get("/cart", this.middleware.checkJsonWebToken, (req, res) =>
      this.controller.getCart(req, res)
    );
  }
}
