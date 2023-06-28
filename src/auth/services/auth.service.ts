import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { ConfigServer } from "../../config/config";
import { UserService } from "../../user/services/user.service";
import { UserEntity } from "../../user/entities/user.entity";
import { PayloadToken } from "../interfaces/auth.interface";

export class AuthService extends ConfigServer {
  constructor(
    private readonly userService: UserService = new UserService(),
    private readonly jwtInstance = jwt
  ) {
    super();
  }

  public async validateUser(
    username: string,
    password: string
  ): Promise<UserEntity | null> {
    const userByEmail = await this.userService.findUserByEmail(username);
    const userByUsername = await this.userService.findUserByUsername(username);

    if (userByEmail && userByEmail.email === username) {
      const isMatch = await bcrypt.compare(password, userByEmail.password);
      if (isMatch) {
        return userByEmail;
      }
    }

    if (userByUsername && userByUsername.username === username) {
      const isMatch = await bcrypt.compare(password, userByUsername.password);
      if (isMatch) {
        return userByUsername;
      }
    }

    return null;
  }

  signJWT(payoad: jwt.JwtPayload, secret: any) {
    return this.jwtInstance.sign(payoad, secret, {
      expiresIn: "4h",
    });
  }

  public async generateJWT(
    user: UserEntity
  ): Promise<{ accessToken: string; user: UserEntity }> {
    const userConsult = await this.userService.findUserWithRole(
      user.id,
      user.role
    );

    const payload: PayloadToken = {
      role: userConsult!.role,
      id: userConsult!.id,
    };

    if (userConsult) {
      user.password = "Not permission";
    }

    return {
      accessToken: this.signJWT(payload, this.getEnvironment("JWT_SECRET")),
      user,
    };
  }
}
