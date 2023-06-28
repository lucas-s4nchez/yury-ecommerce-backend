import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { ConfigServer } from "../../config/config";
import { UserService } from "../../user/services/user.service";
import { PayloadToken } from "../../auth/interfaces/auth.interface";
import { RoleType } from "../../user/types/role.types";
import { UserEntity } from "../../user/entities/user.entity";
import { HttpResponse } from "../response/http.response";

export class SharedMiddleware extends ConfigServer {
  constructor(
    private readonly userService: UserService = new UserService(),
    public httpResponse: HttpResponse = new HttpResponse(),
    private readonly jwtInstance = jwt
  ) {
    super();
  }

  checkJsonWebToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Extraer el token del encabezado
    const authorizationHeader = req.header("Authorization");
    if (!authorizationHeader) {
      return this.httpResponse.Unauthorized(res, "No hay token en la petición");
    }

    // Dividir el encabezado en "Bearer" y el token
    const [bearer, token] = authorizationHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return this.httpResponse.Unauthorized(res, "Formato de token inválido");
    }

    try {
      //si el token es valido, extrae el id
      const { id } = this.jwtInstance.verify(
        token,
        this.getEnvironment("JWT_SECRET") || "hola@correo"
      ) as PayloadToken;

      //Verificar si el usuario existe
      const user = await this.userService.findUserById(id);
      if (!user) {
        return this.httpResponse.Unauthorized(res, "Token no válido");
      }

      //guarda el usuario autenticado en el req.user
      req.user = user;

      next();
    } catch (error) {
      //si el token no es valido
      return this.httpResponse.Unauthorized(res, "Token no válido");
    }
  };
  checkCustomerRole(req: Request, res: Response, next: NextFunction) {
    const user = req.user as UserEntity;
    if (user.role !== RoleType.CUSTOMER) {
      return this.httpResponse.Unauthorized(
        res,
        "No tienes permiso, solo pueden acceder clientes"
      );
    }
    return next();
  }
  checkAdminRole(req: Request, res: Response, next: NextFunction) {
    const user = req.user as UserEntity;
    if (user.role !== RoleType.ADMIN) {
      return this.httpResponse.Unauthorized(
        res,
        "No tienes permiso, solo pueden acceder administradores"
      );
    }
    return next();
  }
}
