import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { RoleType } from "../types/role.types";
import { IsEmailUnique } from "../validators/email-unique.validator";
import { IsUsernameUnique } from "../validators/username-unique.validator";
import {
  AlphaWithSpecialCharactersRegex,
  AlphanumericWithSpecialCharactersRegex,
  NumericRangeRegex,
  PasswordValidationRegex,
} from "../../shared/helpers/regEx.helper";

export class CreateUserDTO extends BaseDTO {
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

  @IsNotEmpty({ message: "El nombre de usuario es requerido" })
  @IsString({ message: "Tipo de dato incorrecto" })
  @Matches(AlphanumericWithSpecialCharactersRegex, {
    message:
      "El nombre de usuario solo puede contener letras, numeros y caracteres especiales como acentos y diéresis en español",
  })
  @Length(3, 20, {
    message: "El nombre de usuario debe tener entre 3 y 20 caracteres",
  })
  @IsUsernameUnique()
  username!: string;

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

export class UpdateNameDTO {
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsString({ message: "Tipo de dato incorrecto" })
  @Length(3, 100, {
    message: "El nombre debe tener entre 3 y 100 caracteres",
  })
  name!: string;
}

export class UpdateLastNameDTO {
  @IsNotEmpty({ message: "El apellido es requerido" })
  @IsString({ message: "Tipo de dato incorrecto" })
  @Length(3, 100, {
    message: "El apellido debe tener entre 3 y 100 caracteres",
  })
  lastName!: string;
}

export class UpdateUsernameDTO {
  @IsNotEmpty({ message: "El nombre de usuario es requerido" })
  @IsString({ message: "Tipo de dato incorrecto" })
  @Matches(AlphanumericWithSpecialCharactersRegex, {
    message:
      "El nombre de usuario solo puede contener letras, numeros y caracteres especiales como acentos y diéresis en español",
  })
  @Length(3, 20, {
    message: "El nombre de usuario debe tener entre 3 y 20 caracteres",
  })
  username!: string;
}

export class UpdateEmailDTO {
  @IsNotEmpty({ message: "El email es requerido" })
  @IsEmail({}, { message: "El email debe tener un formato válido" })
  @MaxLength(100, { message: "El email no puede exceder los 100 caracteres" })
  email!: string;
}

export class UpdatePasswordDTO {
  @IsNotEmpty({ message: "La contraseña es requerida" })
  @Length(8, 20, {
    message: "La contraseña debe tener entre 8 y 20 caracteres",
  })
  @Matches(PasswordValidationRegex, {
    message:
      "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número (sin acentos o caracteres especiales)",
  })
  password!: string;
}

export class UpdateAdvancedUserDTO extends BaseDTO {
  @IsNotEmpty({ message: "La provincia es requerida" })
  @Matches(AlphaWithSpecialCharactersRegex, {
    message: "La provincia solo puede contener letras",
  })
  @Length(3, 100, {
    message: "La provincia debe tener entre 3 y 100 caracteres",
  })
  province!: string;

  @IsNotEmpty({ message: "La ciudad es requerida" })
  @Matches(AlphaWithSpecialCharactersRegex, {
    message: "La ciudad solo puede contener letras",
  })
  @Length(3, 150, {
    message: "La cuidad debe tener entre 3 y 150 caracteres",
  })
  city!: string;

  @IsNotEmpty({ message: "La dirección es requerida" })
  @Matches(AlphanumericWithSpecialCharactersRegex, {
    message: "La dirección solo puede contener letras y números",
  })
  @Length(3, 150, {
    message: "La direción debe tener entre 3 y 150 caracteres",
  })
  address!: string;

  @IsNotEmpty({ message: "el DNI es requerido" })
  @IsNumberString({ locale: "es-ES" }, { message: "el DNI no es válido" })
  @Length(8, 8, {
    message: "El DNI debe tener 8 caracteres",
  })
  dni!: string;

  @IsNotEmpty({ message: "El número de teléfono es requerido" })
  @IsString({ message: "Tipo de dato incorrecto" })
  @Matches(NumericRangeRegex, { message: "El número de teléfono no es válido" })
  phone!: string;
}
