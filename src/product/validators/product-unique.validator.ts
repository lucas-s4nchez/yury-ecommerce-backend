import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { ProductService } from "../services/product.service";

@ValidatorConstraint({ name: "IsProductUnique", async: true })
export class IsProductUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly productService: ProductService) {}

  async validate(name: string, args: ValidationArguments) {
    const product = await this.productService.findProductByName(name);
    return !product; // Devuelve verdadero si el name no está registrado, falso si está registrado
  }

  defaultMessage(args: ValidationArguments) {
    return `El producto '${args.value}' ya está registrado`;
  }
}

export function IsProductUnique(validationOptions?: ValidationOptions) {
  const productService = new ProductService(); // Crear una instancia de categoryService aquí

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsProductUniqueConstraint(productService),
    });
  };
}
