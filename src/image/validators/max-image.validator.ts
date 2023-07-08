import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { ProductService } from "../../product/services/product.service";

@ValidatorConstraint({ name: "IsMaxImagesPerProduct", async: true })
export class IsMaxImagesPerProductConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly productService: ProductService) {}
  private maxImages = 4; // Número máximo de imágenes permitidas por producto

  async validate(product: string, args: ValidationArguments) {
    const imageCount = await this.productService.getImageCount(product);
    return imageCount <= this.maxImages;
  }

  defaultMessage(args: ValidationArguments) {
    return `El producto tiene un máximo de ${this.maxImages} imágenes permitidas`;
  }
}
export function IsMaxImagesPerProduct(validationOptions?: ValidationOptions) {
  const productService = new ProductService(); // Crea una instancia del servicio ProductService aquí

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsMaxImagesPerProductConstraint(productService), // Pasa la instancia de ProductService al constructor
    });
  };
}
