import { UserEntity } from "./src/user/entities/user.entity";

declare module "express-serve-static-core" {
  interface Request {
    user: UserEntity;
  }
}
