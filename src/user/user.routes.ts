import { UserController } from "./controllers/user.controller";
import { BaseRouter } from "../shared/router/router";
import { UserMiddleware } from "./middlewares/user.middleware";

export class UserRoute extends BaseRouter<UserController, UserMiddleware> {
  constructor() {
    super(UserController, UserMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de usuario
  routes(): void {
    this.router.get("/users", this.middleware.checkJsonWebToken, (req, res) =>
      this.controller.getUser(req, res)
    );
    this.router.get(
      "/users/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.getUserById(req, res)
    );
    this.router.put(
      "/users/updateName",
      this.middleware.checkJsonWebToken,
      this.middleware.updateNameValidator.bind(this.middleware),
      (req, res) => this.controller.updateName(req, res)
    );
    this.router.put(
      "/users/updateLastName",
      this.middleware.checkJsonWebToken,
      this.middleware.updateLastNameValidator.bind(this.middleware),
      (req, res) => this.controller.updateLastName(req, res)
    );
    this.router.put(
      "/users/updateEmail",
      this.middleware.checkJsonWebToken,
      this.middleware.updateEmailValidator.bind(this.middleware),
      (req, res) => this.controller.updateEmail(req, res)
    );
    this.router.put(
      "/users/updatePassword",
      this.middleware.checkJsonWebToken,
      this.middleware.updatePasswordValidator.bind(this.middleware),
      (req, res) => this.controller.updatePassword(req, res)
    );
    this.router.put(
      "/users/updateAdvancedUser/:id",
      this.middleware.checkJsonWebToken,
      this.middleware.updateAdvancedUserValidator.bind(this.middleware),
      (req, res) => this.controller.updateAdvancedUser(req, res)
    );
    this.router.delete(
      "/users/:id",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.deleteUser(req, res)
    );
  }
}
