import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { SizeService } from "../../size/services/size.service";

@ValidatorConstraint({ name: "IsSizeRelatedToProduct", async: true })
export class IsSizeRelatedToProductConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly sizeService: SizeService) {}

  async validate(size: string, args: ValidationArguments) {
    const validatedObject = args.object as { product: string }; // Asegurar que args.object tiene la propiedad 'product' de tipo string
    const productId = validatedObject.product; // Obtener el ID del producto desde el objeto validado
    const existingSizeInProduct =
      await this.sizeService.findSizeRelatedToProduct(size, productId);
    return !!existingSizeInProduct; // Devuelve verdadero si el tamaño está relacionado con el producto, falso si no lo está
  }

  defaultMessage(args: ValidationArguments) {
    return "No existe este talle para este producto";
  }
}
export function IsSizeRelatedToProduct(validationOptions?: ValidationOptions) {
  const sizeService = new SizeService();

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsSizeRelatedToProductConstraint(sizeService),
    });
  };
}
