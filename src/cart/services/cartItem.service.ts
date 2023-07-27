import { QueryRunner } from "typeorm";
import { BaseService } from "../../config/base.service";
import { CartItemEntity } from "../entities/cartItem.entity";
import { CartItemDTO } from "../dto/cartItem.dto";
import { CartEntity } from "../entities/cart.entity";
import { AppDataSource } from "../../config/data.source";

export class CartItemService extends BaseService<CartItemEntity> {
  constructor() {
    super(CartItemEntity);
  }

  async findAllCartItems(cartId: string): Promise<CartItemEntity[]> {
    return (await this.execRepository)
      .createQueryBuilder("cartItems")
      .leftJoinAndSelect("cartItems.size", "size")
      .leftJoinAndSelect("cartItems.product", "product")
      .leftJoinAndSelect("product.stock", "stock")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.sizes", "sizes")
      .leftJoinAndSelect("product.images", "images")
      .where("cartItems.cart_id = :cartId", { cartId })
      .getMany();
  }

  async findCartItemById(
    id: string,
    cartId: string
  ): Promise<CartItemEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("cartItem")
      .leftJoinAndSelect("cartItem.size", "size")
      .leftJoinAndSelect("cartItem.product", "product")
      .leftJoinAndSelect("product.stock", "stock")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.sizes", "sizes")
      .leftJoinAndSelect("product.images", "images")
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

  async findCartItemByProductId(
    cartId: string,
    productId: string
  ): Promise<CartItemEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("cartItem")
      .where("cartItem.product = :productId", {
        productId,
      })
      .andWhere("cartItem.cart = :cartId", {
        cartId,
      })
      .leftJoinAndSelect("cartItem.product", "product")
      .leftJoinAndSelect("product.stock", "stock")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.sizes", "size")
      .getOne();
  }

  async findCartItemsByProductId(
    cartId: string,
    productId: string
  ): Promise<CartItemEntity[] | null> {
    return (await this.execRepository)
      .createQueryBuilder("cartItem")
      .where("cartItem.product = :productId", {
        productId,
      })
      .andWhere("cartItem.cart = :cartId", {
        cartId,
      })
      .leftJoinAndSelect("cartItem.product", "product")
      .leftJoinAndSelect("product.stock", "stock")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.sizes", "size")
      .getMany();
  }

  async createCartItem(
    body: CartItemDTO,
    cartId: string
  ): Promise<CartItemEntity | null> {
    // Crear un query runner
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //Crear el cartItem
      const cartItem = new CartItemEntity();
      Object.assign(cartItem, body);

      const savedCartItem = await queryRunner.manager.save(cartItem);

      //Buscar el carrito para actualizarlo
      const cart = await queryRunner.manager.findOne(CartEntity, {
        where: { id: cartId },
        relations: [
          "cartItems",
          "cartItems.product",
          "cartItems.product.brand",
          "cartItems.product.stock",
          "cartItems.product.images",
          "cartItems.size",
          "user",
        ],
      });

      if (cart) {
        // Guardar el carrito actualizado en la base de datos
        await queryRunner.manager.save(cart);
      }

      // Commit de la transacción
      await queryRunner.commitTransaction();

      return savedCartItem;
    } catch (error) {
      // Rollback de la transacción en caso de error
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      // Liberar el query runner
      await queryRunner.release();
    }
  }

  async updateCartItem(
    cartItem: CartItemEntity,
    cartId: string
  ): Promise<CartItemEntity | null> {
    // Crear un query runner
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //guardar el cartItem
      const savedCartItem = await queryRunner.manager.save(cartItem);

      //Buscar el carrito para actualizarlo
      const cart = await queryRunner.manager.findOne(CartEntity, {
        where: { id: cartId },
        relations: [
          "cartItems",
          "cartItems.product",
          "cartItems.product.brand",
          "cartItems.product.stock",
          "cartItems.product.images",
          "cartItems.size",
          "user",
        ],
      });

      if (cart) {
        // Guardar el carrito actualizado en la base de datos
        await queryRunner.manager.save(cart);
      }

      // Commit de la transacción
      await queryRunner.commitTransaction();

      return savedCartItem;
    } catch (error) {
      // Rollback de la transacción en caso de error
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      // Liberar el query runner
      await queryRunner.release();
    }
  }

  async deleteCartItem(
    cartItem: CartItemEntity,
    cartId: string
  ): Promise<CartItemEntity | null> {
    // Crear un query runner
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //eliminar el cartItem
      const savedCartItem = await queryRunner.manager.remove(cartItem);

      //Buscar el carrito para actualizarlo
      const cart = await queryRunner.manager.findOne(CartEntity, {
        where: { id: cartId },
        relations: [
          "cartItems",
          "cartItems.product",
          "cartItems.product.brand",
          "cartItems.product.stock",
          "cartItems.product.images",
          "cartItems.size",
          "user",
        ],
      });

      if (cart) {
        // Guardar el carrito actualizado en la base de datos
        await queryRunner.manager.save(cart);
      }

      // Commit de la transacción
      await queryRunner.commitTransaction();

      return savedCartItem;
    } catch (error) {
      // Rollback de la transacción en caso de error
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      // Liberar el query runner
      await queryRunner.release();
    }
  }
}
