import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { AuthService } from "../services/auth.service";
import { UserService } from "../../user/services/user.service";

export class AuthController {
  constructor(
    private readonly userService: UserService = new UserService(),
    private readonly authService: AuthService = new AuthService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await this.authService.validateUser(email, password);

      //Verificar si existe el usuario y la contraseña coincide
      if (!user) {
        return this.httpResponse.BadRequest(
          res,
          "El usuario o contraseña no son correctos"
        );
      }

      //Verificar si el usuario no fue eliminado
      if (!user.state) {
        return this.httpResponse.Unauthorized(res, "El usuario fue eliminado");
      }

      //Generar json web token
      const data = await this.authService.generateJWT(user);

      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  };

  register = async (req: Request, res: Response) => {
    const { province, city, address, dni, phone, ...userData } = req.body;
    try {
      const user = await this.userService.createUser(userData);
      if (!user) {
        return this.httpResponse.BadRequest(res, "Error al crear usuario");
      }
      return this.httpResponse.Ok(res, "Usuario creado con éxito!");
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    const userId = req.user.id;
    try {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        return this.httpResponse.BadRequest(
          res,
          "Error al refrescar el token de acceso"
        );
      }

      //Generar un jwt
      const data = await this.authService.generateJWT(user);

      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  };
}
