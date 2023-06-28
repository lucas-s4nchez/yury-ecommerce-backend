import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { UserService } from "../services/user.service";

@ValidatorConstraint({ name: "IsUsernameUnique", async: true })
export class IsUsernameUniqueConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UserService) {}

  async validate(username: string, args: ValidationArguments) {
    const user = await this.userService.findUserByUsername(username);
    return !user; // Devuelve verdadero si el username no está registrado, falso si está registrado
  }

  defaultMessage(args: ValidationArguments) {
    return `El nombre de usuario '${args.value}' ya está registrado`;
  }
}

export function IsUsernameUnique(validationOptions?: ValidationOptions) {
  const userService = new UserService(); // Crear una instancia de UserService aquí

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsUsernameUniqueConstraint(userService), // Pasar la instancia de UserService al constructor
    });
  };
}
