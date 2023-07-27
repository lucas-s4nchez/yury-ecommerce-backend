import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { IsCategoryUnique } from "../validators/category-unique.validator";
import { LettersWithSpacesRegex } from "../../shared/helpers/regEx.helper";

export class CategoryDTO extends BaseDTO {
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsString({ message: "Tipo de dato incorrecto" })
  @Matches(LettersWithSpacesRegex, {
    message: "Solo se permiten letras (sin acentos o caracteres especiales)",
  })
  @Length(3, 50, { message: "El nombre debe tener entre 3 y 50 caracteres" })
  @IsCategoryUnique()
  name!: string;
}

export class UpdateCategoryDTO extends BaseDTO {
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsString({ message: "Tipo de dato incorrecto" })
  @Matches(LettersWithSpacesRegex, {
    message: "Solo se permiten letras (sin acentos o caracteres especiales)",
  })
  @Length(3, 50, { message: "El nombre debe tener entre 3 y 50 caracteres" })
  name!: string;
}
