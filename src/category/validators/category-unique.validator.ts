import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { CategoryService } from "../services/category.service";

@ValidatorConstraint({ name: "IsCategoryUnique", async: true })
export class IsCategoryUniqueConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly categoryService: CategoryService) {}

  async validate(name: string, args: ValidationArguments) {
    const category = await this.categoryService.findCategoryByName(name);
    return !category; // Devuelve verdadero si el name no está registrado, falso si está registrado
  }

  defaultMessage(args: ValidationArguments) {
    return `La categoria '${args.value}' ya está registrada`;
  }
}

export function IsCategoryUnique(validationOptions?: ValidationOptions) {
  const categoryService = new CategoryService(); // Crear una instancia de categoryService aquí

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsCategoryUniqueConstraint(categoryService), // Pasar la instancia de categoryService al constructor
    });
  };
}
