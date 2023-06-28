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
      "/user/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.getUserById(req, res)
    );
    this.router.post(
      "/createUser",
      this.middleware.checkJsonWebToken,
      this.middleware.userValidator.bind(this.middleware),
      (req, res) => this.controller.createUser(req, res)
    );
    this.router.put(
      "/updateUserToCustomer/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.updateUserToCustomer(req, res)
    );
    this.router.put(
      "/updateBasicUser/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.updateBasicUser(req, res)
    );
    this.router.put(
      "/updateAdvancedUser/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.updateAdvancedUser(req, res)
    );
    this.router.delete(
      "/deleteUser/:id",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.deleteUser(req, res)
    );
  }
}
