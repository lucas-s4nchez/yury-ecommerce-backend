import { DeleteResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { CartEntity } from "../entities/cart.entity";
import { CartDTO } from "../dto/cart.dto";

export class CartService extends BaseService<CartEntity> {
  constructor() {
    super(CartEntity);
  }

  async findCartById(id: string): Promise<CartEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("cart")
      .leftJoinAndSelect("cart.cartItems", "cartItem")
      .leftJoinAndSelect("cartItem.product", "product")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.stock", "stock")
      .leftJoinAndSelect("product.images", "images")
      .leftJoinAndSelect("cartItem.size", "size")
      .leftJoinAndSelect("cart.user", "user")
      .where({ id })
      .getOne();
  }

  async createCart(body: CartDTO): Promise<CartEntity> {
    return (await this.execRepository).save(body);
  }

  async updateCartInfo(cartId: string): Promise<CartEntity | null> {
    const cart = await this.findCartById(cartId);

    if (cart) {
      // Guardar el carrito actualizado en la base de datos
      await (await this.execRepository).save(cart);
    }

    return cart;
  }

  async deleteCart(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
}
