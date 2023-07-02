import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { LettersWithSpacesRegex } from "../../shared/helpers/regEx.helper";
import { IsBrandUnique } from "../validators/brand-unique.validator";

export class BrandDTO extends BaseDTO {
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsString({ message: "Tipo de dato incorrecto" })
  @Matches(LettersWithSpacesRegex, {
    message: "Solo se permiten letras (sin acentos o caracteres especiales)",
  })
  @Length(3, 50, { message: "El nombre debe tener entre 3 y 50 caracteres" })
  @IsBrandUnique()
  name!: string;
}
