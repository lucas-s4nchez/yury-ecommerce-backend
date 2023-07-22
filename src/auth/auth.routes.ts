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
      "/login",
      this.middleware.loginValidator.bind(this.middleware),
      (req, res) => this.controller.login(req, res)
    );
    this.router.post(
      "/register",
      this.middleware.registerValidator.bind(this.middleware),
      (req, res) => this.controller.register(req, res)
    );
    this.router.get("/refresh", this.middleware.checkJsonWebToken, (req, res) =>
      this.controller.refreshToken(req, res)
    );
  }
}
