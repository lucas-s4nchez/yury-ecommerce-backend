import { DeleteResult, QueryRunner } from "typeorm";
import { BaseService } from "../../config/base.service";
import { CartItemEntity } from "../entities/cartItem.entity";
import { CartItemDTO } from "../dto/cartItem.dto";

export class CartItemService extends BaseService<CartItemEntity> {
  constructor() {
    super(CartItemEntity);
  }

  async findAllCartItems(cartId: string): Promise<CartItemEntity[]> {
    return (await this.execRepository)
      .createQueryBuilder("cartItems")
      .leftJoinAndSelect("cartItems.product", "product")
      .leftJoinAndSelect("product.stock", "stock")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.sizes", "size")
      .where("cartItems.cart_id = :cartId", { cartId })
      .getMany();
  }

  async findCartItemById(
    id: string,
    cartId: string
  ): Promise<CartItemEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("cartItem")
      .leftJoinAndSelect("cartItem.product", "product")
      .leftJoinAndSelect("product.stock", "stock")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.sizes", "size")
      .where("cartItem.cart_id = :cartId", { cartId })
      .andWhere({ id })
      .getOne();
  }

  async findCartItemByCartIdAndProductIdAndSizeId(
    cartId: string,
    productId: string,
    sizeId: string
  ): Promise<CartItemEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("cartItem")
      .where("cartItem.cart = :cartId", { cartId })
      .andWhere("cartItem.product = :productId", {
        productId,
      })
      .andWhere("cartItem.size = :sizeId", { sizeId })
      .leftJoinAndSelect("cartItem.product", "product")
      .leftJoinAndSelect("product.stock", "stock")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.sizes", "size")
      .getOne();
  }

  async createCartItem(body: CartItemDTO): Promise<CartItemEntity> {
    return await (await this.execRepository).save(body);
  }

  async updateCartItem(cartItem: CartItemEntity): Promise<CartItemEntity> {
    return (await this.execRepository).save(cartItem);
  }

  async deleteCartItem(cartItem: CartItemEntity): Promise<CartItemEntity> {
    return (await this.execRepository).remove(cartItem);
  }

  async deleteCartItemWithQueryRunner(
    cartItem: CartItemEntity,
    queryRunner: QueryRunner
  ): Promise<void> {
    await queryRunner.manager.remove(cartItem);
  }

  async deleteAllCartItems(cartId: string): Promise<void> {
    const cartItems = await this.findAllCartItems(cartId);
    await Promise.all(
      cartItems.map((cartItem) => this.deleteCartItem(cartItem))
    );
  }
}
