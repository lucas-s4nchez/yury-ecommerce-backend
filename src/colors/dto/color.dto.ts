import { IsNotEmpty, Length, Matches } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import {
  LettersWithSpacesRegex,
  hexCodeRegex,
} from "../../shared/helpers/regEx.helper";
import { IsColorUnique } from "../validators/color-unique.validator";

export class ColorDTO extends BaseDTO {
  @IsNotEmpty({ message: "El color es requerido" })
  @Matches(LettersWithSpacesRegex, {
    message: "Solo se permiten letras (sin acentos o caracteres especiales)",
  })
  @Length(3, 50, { message: "El color debe tener entre 3 y 50 caracteres" })
  @IsColorUnique()
  name!: string;

  @IsNotEmpty({ message: "El código hexadecimal es requerido" })
  @Matches(hexCodeRegex, { message: "Código hexadecimal no válido" })
  hexCode!: string;
}

export class UpdateColorDTO extends BaseDTO {
  @IsNotEmpty({ message: "El color es requerido" })
  @Matches(LettersWithSpacesRegex, {
    message: "Solo se permiten letras (sin acentos o caracteres especiales)",
  })
  @Length(3, 50, { message: "El color debe tener entre 3 y 50 caracteres" })
  name!: string;

  @IsNotEmpty({ message: "El código hexadecimal es requerido" })
  @Matches(hexCodeRegex, { message: "Código hexadecimal no válido" })
  hexCode!: string;
}
