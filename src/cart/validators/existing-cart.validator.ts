import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { CartService } from "../services/cart.service";

@ValidatorConstraint({ name: "IsCartExisting", async: true })
export class IsCartExistingConstraint implements ValidatorConstraintInterface {
  constructor(private readonly cartService: CartService) {}

  async validate(cart: string, args: ValidationArguments) {
    const existingCart = await this.cartService.findCartById(cart);
    return !!existingCart; // Devuelve verdadero si el carrito existe, falso si no existe
  }

  defaultMessage(args: ValidationArguments) {
    return "No existe este carrito";
  }
}
export function IsCartExisting(validationOptions?: ValidationOptions) {
  const cartService = new CartService();

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsCartExistingConstraint(cartService),
    });
  };
}
