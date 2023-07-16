import { CartEntity } from "./src/cart/entities/cart.entity";
import { UserEntity } from "./src/user/entities/user.entity";

declare module "express-serve-static-core" {
  interface Request {
    user: UserEntity;
    cart: CartEntity;
  }
}
