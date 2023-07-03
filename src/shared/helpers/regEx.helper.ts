//requiere al menos una letra minúscula, una letra mayúscula y un dígito.
export const PasswordValidationRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/;

//letras (mayúsculas y minúsculas), espacios y caracteres especiales como acentos y diéresis en español.
export const AlphaWithSpecialCharactersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;

//letras (mayúsculas y minúsculas), números, espacios y caracteres especiales como acentos y diéresis en español.
export const AlphanumericWithSpecialCharactersRegex =
  /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s]+$/;

//cadenas de texto que contienen únicamente números y tienen una longitud mínima de 8 y máxima de 15 caracteres.
export const NumericRangeRegex = /^[0-9]{8,15}$/;

//letras (mayúsculas o minúsculas) y espacios en blanco.
export const LettersWithSpacesRegex = /^[a-zA-Z\s]+$/;

//codigo hexadecimal, ejemplo: #ffffff
export const hexCodeRegex = /^#([0-9A-Fa-f]{6})$/;
