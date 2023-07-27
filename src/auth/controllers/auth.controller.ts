import * as bcrypt from "bcrypt";
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

  async login(req: Request, res: Response) {
    const email = req.body.email.trim();
    const password = req.body.password.trim();

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
  }

  async register(req: Request, res: Response) {
    const { province, city, address, dni, phone, ...userData } = req.body;
    userData.name = userData.name.trim();
    userData.lastName = userData.lastName.trim();
    userData.email = userData.email.trim();
    userData.password = userData.password.trim();

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
  }

  async refreshToken(req: Request, res: Response) {
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
  }

  async getUserInfo(req: Request, res: Response) {
    const userId = req.user.id;
    try {
      const data = await this.userService.findUserById(userId);
      if (!data) {
        return this.httpResponse.NotFound(res, "Usuario no encontrado");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async updateName(req: Request, res: Response) {
    const userId = req.user.id;
    const name = req.body.name.trim();
    try {
      const existingUser = await this.userService.findUserById(userId);
      if (!existingUser) {
        return this.httpResponse.NotFound(res, "Usuario no encontrado");
      }

      const data = await this.userService.updateName(existingUser, name);
      if (!data) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(
        res,
        "El nombre ha sido actualizado correctamente"
      );
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async updateLastName(req: Request, res: Response) {
    const userId = req.user.id;
    const lastName = req.body.lastName.trim();

    try {
      const existingUser = await this.userService.findUserById(userId);
      if (!existingUser) {
        return this.httpResponse.NotFound(res, "Usuario no encontrado");
      }

      const data = await this.userService.updateLastName(
        existingUser,
        lastName
      );
      if (!data) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(
        res,
        "El apellido ha sido actualizado correctamente"
      );
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async updateEmail(req: Request, res: Response) {
    const userId = req.user.id;
    const email = req.body.email.trim();

    try {
      const existingUser = await this.userService.findUserById(userId);
      if (!existingUser) {
        return this.httpResponse.NotFound(res, "Usuario no encontrado");
      }
      // Verificar y actualizar email si es diferente
      if (email !== existingUser.email) {
        const isEmailTaken = await this.userService.findUserByEmail(email);
        if (isEmailTaken) {
          return this.httpResponse.BadRequest(res, [
            {
              property: "email",
              errors: [`El email '${email}' ya está registrado`],
            },
          ]);
        }
      }

      const data = await this.userService.updateEmail(existingUser, email);
      if (!data) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(
        res,
        "El email ha sido actualizado correctamente"
      );
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async updatePassword(req: Request, res: Response) {
    const userEmail = req.user.email;
    const oldPassword = req.body.oldPassword.trim();
    const password = req.body.password.trim();

    try {
      const existingUser = await this.userService.findUserByEmail(userEmail);
      if (!existingUser) {
        return this.httpResponse.NotFound(res, "Usuario no encontrado");
      }

      const isMatchOldPassword = await bcrypt.compare(
        oldPassword,
        existingUser.password
      );
      if (!isMatchOldPassword) {
        return this.httpResponse.BadRequest(
          res,
          "La contraseña actual proporcionada no coincide con la de éste usuario, intenta otra vez"
        );
      }

      const data = await this.userService.updatePassword(
        existingUser,
        password
      );
      if (!data) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(
        res,
        "La contraseña ha sido actualizada correctamente"
      );
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async updateAdvancedUser(req: Request, res: Response) {
    const userId = req.user.id;
    const { name, lastName, role, password, username, email, ...userData } =
      req.body;
    userData.province = userData.province.trim();
    userData.city = userData.city.trim();
    userData.address = userData.address.trim();
    userData.dni = userData.dni.trim();
    userData.phone = userData.phone.trim();

    try {
      const existingUser = await this.userService.findUserById(userId);
      if (!existingUser) {
        return this.httpResponse.NotFound(res, "Usuario no encontrado");
      }
      const data = await this.userService.updateAdvancedUser(
        existingUser,
        userData
      );
      if (!data) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteAccount(req: Request, res: Response) {
    const userId = req.user.id;
    try {
      const user = await this.userService.findUserById(userId);

      //Verificar si existe el usuario
      if (!user) {
        return this.httpResponse.BadRequest(res, "Usuario no encontrado");
      }

      const data = await this.userService.deleteUser(userId);
      if (!data) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }
      return this.httpResponse.Ok(res, "Usuario eliminado");
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
