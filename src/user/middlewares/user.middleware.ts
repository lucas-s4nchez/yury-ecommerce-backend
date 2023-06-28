import { NextFunction, Request, Response } from "express";
import { UserDTO } from "../dto/user.dto";
import { validate } from "class-validator";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";

export class UserMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  userValidator(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, username, email, password, role } = req.body;
    const validUser = new UserDTO();

    validUser.name = name;
    validUser.lastName = lastName;
    validUser.username = username;
    validUser.email = email;
    validUser.password = password;
    validUser.role = role;

    validate(validUser).then((err) => {
      if (err.length > 0) {
        return this.httpResponse.BadRequest(res, err);
      } else {
        next();
      }
    });
  }
}
