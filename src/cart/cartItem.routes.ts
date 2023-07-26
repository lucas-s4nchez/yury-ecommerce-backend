import { BaseRouter } from "../shared/router/router";
import { CartItemController } from "./controllers/cartItem.controller";
import { CartItemMiddleware } from "./middlewares/cartItem.middleware";

export class CartItemRoute extends BaseRouter<
  CartItemController,
  CartItemMiddleware
> {
  constructor() {
    super(CartItemController, CartItemMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  routes(): void {
    this.router.get(
      "/cart/items",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.getCartItems(req, res)
    );
    this.router.get(
      "/cart/items/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.getCartItemById(req, res)
    );
    this.router.post(
      "/cart/items",
      this.middleware.checkJsonWebToken,
      this.middleware.cartItemValidator.bind(this.middleware),
      (req, res) => this.controller.createCartItem(req, res)
    );

    this.router.put(
      "/cart/items/add_unit/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.addCartItemUnit(req, res)
    );

    this.router.put(
      "/cart/items/subtract_unit/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.subtractCartItemUnit(req, res)
    );

    this.router.delete(
      "/cart/items/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.deleteCartItem(req, res)
    );
  }
}
