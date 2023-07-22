import { UpdateResult } from "typeorm";
import * as bcrypt from "bcrypt";
import { BaseService } from "../../config/base.service";
import { UserEntity } from "../entities/user.entity";
import { RoleType } from "../types/role.types";
import { CreateUserDTO, UpdateAdvancedUserDTO } from "../dto/user.dto";
import { OrderType } from "../../shared/types/shared.types";
import { AppDataSource } from "../../config/data.source";
import { CartEntity } from "../../cart/entities/cart.entity";

export class UserService extends BaseService<UserEntity> {
  constructor() {
    super(UserEntity);
  }

  async findAllUsers(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[UserEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [users, count] = await (await this.execRepository)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.cart", "cart")
      .leftJoinAndSelect("cart.cartItems", "cartItems")
      .orderBy("users.name", order)
      .skip(skipCount)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [users, count, totalPages];
  }

  async findUserWithRole(
    id: string,
    role: RoleType
  ): Promise<UserEntity | null> {
    const user = (await this.execRepository)
      .createQueryBuilder("user")
      .where({ id })
      .andWhere({ role })
      .getOne();

    return user;
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.cart", "cart")
      .leftJoinAndSelect("cart.cartItems", "cartItems")
      .where({ id, state: true })
      .getOne();
  }

  async findUserByIdForDelete(id: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.favorites", "favorites")
      .leftJoinAndSelect("user.cart", "cart")
      .leftJoinAndSelect("cart.cartItems", "cartItems")
      .where({ id, state: true })
      .getOne();
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("users")
      .addSelect("users.password")
      .where({ email })
      .getOne();
  }

  async createUser(body: CreateUserDTO): Promise<UserEntity | null> {
    // Crear un query runner
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //Crear un usuario
      const user = new UserEntity();
      Object.assign(user, body);
      const hashPassword = await bcrypt.hash(user.password, 10);
      user.password = hashPassword;
      const savedUser = await queryRunner.manager.save(user);

      //Crear su carrito de compras y asignarlo al usuario
      const cart = new CartEntity();
      cart.user = savedUser;
      cart.cartItems = [];
      const savedCart = await queryRunner.manager.save(cart);
      savedUser.cart = savedCart;

      const result = await queryRunner.manager.save(savedUser);
      // Commit de la transacción
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  async updateName(user: UserEntity, name: string): Promise<UserEntity> {
    user.name = name;
    return (await this.execRepository).save(user);
  }

  async updateLastName(
    user: UserEntity,
    lastName: string
  ): Promise<UserEntity> {
    user.lastName = lastName;
    return (await this.execRepository).save(user);
  }

  async updateEmail(user: UserEntity, email: string): Promise<UserEntity> {
    user.email = email;
    return (await this.execRepository).save(user);
  }

  async updatePassword(
    user: UserEntity,
    password: string
  ): Promise<UserEntity | null> {
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    return (await this.execRepository).save(user);
  }

  async updateAdvancedUser(
    id: string,
    body: UpdateAdvancedUserDTO
  ): Promise<UpdateResult> {
    return (await this.execRepository).update({ id }, body);
  }

  async deleteUser(id: string): Promise<UserEntity | null> {
    // Obtener el producto existente
    const existingUser = await this.findUserByIdForDelete(id);
    if (!existingUser) {
      return null;
    }

    // Crear un query runner
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //Eliminar el carrito relacionado al usuario
      const cart = existingUser.cart;
      if (cart) {
        cart.state = false;
        await queryRunner.manager.save(cart);
      }
      // Eliminar los items del carrito relacionados al carrito
      const cartItems = existingUser.cart.cartItems;
      if (cartItems) {
        for (const cartItem of cartItems) {
          await queryRunner.manager.remove(cartItem);
        }
      }

      // Eliminar los favoritos relacionados al usuario
      const favorites = existingUser.favorites;
      if (favorites) {
        for (const favorite of favorites) {
          await queryRunner.manager.remove(favorite);
        }
      }

      // Actualizar el estado del usuario
      existingUser.state = false;

      // Guardar los cambios en la base de datos
      const updateResult = await queryRunner.manager.save(existingUser);
      // Commit de la transacción
      await queryRunner.commitTransaction();

      return updateResult;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }
}
