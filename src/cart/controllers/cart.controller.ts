import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { CartService } from "../services/cart.service";

export class CartController {
  constructor(
    private readonly cartService: CartService = new CartService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getCart(req: Request, res: Response) {
    const user = req.user;
    try {
      const data = await this.cartService.findCartById(user.cart.id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe este carrito");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
