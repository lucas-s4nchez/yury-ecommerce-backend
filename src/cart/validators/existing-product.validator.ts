import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { ProductService } from "../../product/services/product.service";

@ValidatorConstraint({ name: "IsProductExisting", async: true })
export class IsProductExistingConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly productService: ProductService) {}

  async validate(product: string, args: ValidationArguments) {
    const existingProduct = await this.productService.findProductById(product);
    return !!existingProduct; // Devuelve verdadero si el producto existe, falso si no existe
  }

  defaultMessage(args: ValidationArguments) {
    return "No existe este producto";
  }
}

export function IsProductExisting(validationOptions?: ValidationOptions) {
  const productService = new ProductService();

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsProductExistingConstraint(productService),
    });
  };
}
