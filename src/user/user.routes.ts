import { UserController } from "./controllers/user.controller";
import { BaseRouter } from "../shared/router/router";
import { UserMiddleware } from "./middlewares/user.middleware";

export class UserRoute extends BaseRouter<UserController, UserMiddleware> {
  constructor() {
    super(UserController, UserMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de usuario
  routes(): void {
    this.router.get(
      "/users",
      (req, res, next) => this.middleware.checkJsonWebToken(req, res, next),
      (req, res) => this.controller.getUser(req, res)
    );
    this.router.get("/user/:id", (req, res) =>
      this.controller.getUserById(req, res)
    );
    this.router.post(
      "/createUser",
      (req, res, next) => [this.middleware.userValidator(req, res, next)],
      (req, res) => this.controller.createUser(req, res)
    );
    this.router.put("/updateUserToCustomer/:id", (req, res) =>
      this.controller.updateUserToCustomer(req, res)
    );
    this.router.put("/updateBasicUser/:id", (req, res) =>
      this.controller.updateBasicUser(req, res)
    );
    this.router.put("/updateAdvancedUser/:id", (req, res) =>
      this.controller.updateAdvancedUser(req, res)
    );
    this.router.delete("/deleteUser/:id", (req, res) =>
      this.controller.deleteUser(req, res)
    );
  }
}
