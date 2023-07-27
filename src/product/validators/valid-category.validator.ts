import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationArguments,
} from "class-validator";
import { CategoryService } from "../../category/services/category.service";

@ValidatorConstraint({ name: "IsValidCategory", async: false })
export class IsValidCategoryConstraint implements ValidatorConstraintInterface {
  constructor(private readonly categoryService: CategoryService) {}

  async validate(category: string, args: ValidationArguments) {
    const existingCategory = await this.categoryService.findCategoryById(
      category
    );
    if (!existingCategory) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `No se encontraron categorias que coincidan con las proporcionadas`;
  }
}

export function IsValidCategory(validationOptions?: ValidationOptions) {
  const categoryService = new CategoryService(); // Crear una instancia de CategoryService aquí
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsValidCategoryConstraint(categoryService),
    });
  };
}
