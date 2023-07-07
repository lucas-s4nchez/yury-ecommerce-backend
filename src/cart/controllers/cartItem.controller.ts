import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { DeleteResult } from "typeorm";
import { CartItemService } from "../services/cartItem.service";
import { ProductService } from "../../product/services/product.service";
import { CartService } from "../services/cart.service";
import { SizeService } from "../../size/services/size.service";

export class CartItemController {
  constructor(
    private readonly cartItemService: CartItemService = new CartItemService(),
    private readonly cartService: CartService = new CartService(),
    private readonly productService: ProductService = new ProductService(),
    private readonly sizeService: SizeService = new SizeService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getCartItems(req: Request, res: Response) {
    const cartId = req.user.cart.id;
    try {
      const data = await this.cartItemService.findAllCartItems(cartId);
      if (data.length === 0) {
        return this.httpResponse.NotFound(
          res,
          "No hay productos en el carrito"
        );
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async getCartItemById(req: Request, res: Response) {
    const { id } = req.params;
    const cartId = req.user.cart.id;
    try {
      const data = await this.cartItemService.findCartItemById(id, cartId);
      if (!data) {
        return this.httpResponse.NotFound(
          res,
          "No existe este producto en el carrito"
        );
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async createCartItem(req: Request, res: Response) {
    const cartItemData = req.body;

    try {
      const existingCartItem =
        await this.cartItemService.findCartItemByCartIdAndProductIdAndSizeId(
          cartItemData.cart,
          cartItemData.product,
          cartItemData.size
        );

      if (existingCartItem) {
        existingCartItem.quantity += cartItemData.quantity;
        const data = await this.cartItemService.updateCartItem(
          existingCartItem
        );
        // Actualizar el cart relacionado
        await this.cartService.updateCartInfo(cartItemData.cart);
        return this.httpResponse.Ok(res, data);
      } else {
        const data = await this.cartItemService.createCartItem(cartItemData);
        // Actualizar el cart relacionado
        await this.cartService.updateCartInfo(cartItemData.cart);
        return this.httpResponse.Ok(res, data);
      }
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async addCartItemUnit(req: Request, res: Response) {
    const { id } = req.params;
    const cartId = req.user.cart.id;
    try {
      const existingCartItem = await this.cartItemService.findCartItemById(
        id,
        cartId
      );

      if (!existingCartItem) {
        return this.httpResponse.NotFound(
          res,
          "No existe este producto en el carrito"
        );
      }
      existingCartItem.quantity += 1;
      await this.cartItemService.updateCartItem(existingCartItem);
      await this.cartService.updateCartInfo(cartId);
      return this.httpResponse.Ok(
        res,
        `Se agrego una unidad del producto ${existingCartItem.product.name}`
      );
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async subtractCartItemUnit(req: Request, res: Response) {
    const { id } = req.params;
    const cartId = req.user.cart.id;
    try {
      const existingCartItem = await this.cartItemService.findCartItemById(
        id,
        cartId
      );

      if (!existingCartItem) {
        return this.httpResponse.NotFound(
          res,
          "No existe este producto en el carrito"
        );
      }
      if (existingCartItem.quantity <= 1) {
        return this.httpResponse.NotFound(
          res,
          "No puedes quitar mas unidades de este producto"
        );
      }
      existingCartItem.quantity -= 1;
      await this.cartItemService.updateCartItem(existingCartItem);

      // Actualizar el cart relacionado
      await this.cartService.updateCartInfo(cartId);

      return this.httpResponse.Ok(
        res,
        `Se quitó una unidad del producto ${existingCartItem.product.name}`
      );
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteCartItem(req: Request, res: Response) {
    const { id } = req.params;
    const cartId = req.user.cart.id;

    try {
      const existingCartItem = await this.cartItemService.findCartItemById(
        id,
        cartId
      );
      if (!existingCartItem) {
        return this.httpResponse.NotFound(
          res,
          "No existe este producto en el carrito"
        );
      }
      await this.cartItemService.deleteCartItem(existingCartItem);
      // Actualizar el cart relacionado
      await this.cartService.updateCartInfo(cartId);

      return this.httpResponse.Ok(res, "Producto eliminado del carrito");
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteAllCartItems(req: Request, res: Response) {
    const cartId = req.user.cart.id;

    try {
      const existingCart = await this.cartService.findCartById(cartId);
      if (!existingCart?.cartItems.length) {
        return this.httpResponse.NotFound(
          res,
          "No hay productos en el carrito"
        );
      }
      //eliminar todos los items del carrito
      await this.cartItemService.deleteAllCartItems(cartId);
      // Actualizar el cart relacionado
      await this.cartService.updateCartInfo(cartId);

      return this.httpResponse.Ok(
        res,
        "Todos los productos del carrito han sido eliminados"
      );
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
