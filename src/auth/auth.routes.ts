import { BaseRouter } from "../shared/router/router";
import { AuthController } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middlewares/auth.middleware";

export class AuthRoute extends BaseRouter<AuthController, AuthMiddleware> {
  constructor() {
    super(AuthController, AuthMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de autenticacion
  routes(): void {
    this.router.post(
      "/auth/login",
      this.middleware.loginValidator.bind(this.middleware),
      (req, res) => this.controller.login(req, res)
    );
    this.router.post(
      "/auth/register",
      this.middleware.registerValidator.bind(this.middleware),
      (req, res) => this.controller.register(req, res)
    );
    this.router.get(
      "/auth/refreshToken",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.refreshToken(req, res)
    );
    this.router.get(
      "/auth/myInfo",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.getUserInfo(req, res)
    );
    this.router.put(
      "/auth/updateName",
      this.middleware.checkJsonWebToken,
      this.middleware.updateNameValidator.bind(this.middleware),
      (req, res) => this.controller.updateName(req, res)
    );
    this.router.put(
      "/auth/updateLastName",
      this.middleware.checkJsonWebToken,
      this.middleware.updateLastNameValidator.bind(this.middleware),
      (req, res) => this.controller.updateLastName(req, res)
    );
    this.router.put(
      "/auth/updateEmail",
      this.middleware.checkJsonWebToken,
      this.middleware.updateEmailValidator.bind(this.middleware),
      (req, res) => this.controller.updateEmail(req, res)
    );
    this.router.put(
      "/auth/updatePassword",
      this.middleware.checkJsonWebToken,
      this.middleware.updatePasswordValidator.bind(this.middleware),
      (req, res) => this.controller.updatePassword(req, res)
    );
    this.router.put(
      "/auth/updateAdvancedUser",
      this.middleware.checkJsonWebToken,
      this.middleware.updateAdvancedUserValidator.bind(this.middleware),
      (req, res) => this.controller.updateAdvancedUser(req, res)
    );
    this.router.delete(
      "/auth/deleteAccount",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.deleteAccount(req, res)
    );
  }
}
