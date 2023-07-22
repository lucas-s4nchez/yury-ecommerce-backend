import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { PasswordValidationRegex } from "../../shared/helpers/regEx.helper";
import { IsEmailUnique } from "../../user/validators/email-unique.validator";
import { RoleType } from "../../user/types/role.types";

export class RegisterUserDTO extends BaseDTO {
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsString({ message: "Tipo de dato incorrecto" })
  @Length(3, 100, {
    message: "El nombre debe tener entre 3 y 100 caracteres",
  })
  name!: string;

  @IsNotEmpty({ message: "El apellido es requerido" })
  @IsString({ message: "Tipo de dato incorrecto" })
  @Length(3, 100, {
    message: "El apellido debe tener entre 3 y 100 caracteres",
  })
  lastName!: string;

  @IsNotEmpty({ message: "El email es requerido" })
  @IsEmail({}, { message: "El email debe tener un formato válido" })
  @MaxLength(100, { message: "El email no puede exceder los 100 caracteres" })
  @IsEmailUnique()
  email!: string;

  @IsNotEmpty({ message: "La contraseña es requerida" })
  @Length(8, 20, {
    message: "La contraseña debe tener entre 8 y 20 caracteres",
  })
  @Matches(PasswordValidationRegex, {
    message:
      "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número (sin acentos o caracteres especiales)",
  })
  password!: string;

  @IsOptional()
  @IsEnum(RoleType, { message: "El valor del rol no es válido" })
  role!: RoleType;
}

export class LoginUserDTO {
  @IsNotEmpty({ message: "El email es requerido" })
  email!: string;

  @IsNotEmpty({ message: "La contraseña es requerida" })
  password!: string;
}
