import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { AuthService } from "../services/auth.service";

export class AuthController extends AuthService {
  constructor(
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {
    super();
  }

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
      const user = await this.validateUser(username, password);

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
      const data = await this.generateJWT(user);

      res.json(data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  };
}
