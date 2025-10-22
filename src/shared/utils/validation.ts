/**
 * Utilidades de validación para formularios
 * Siguiendo estándares argentinos y mejores prácticas
 */

// ============================================
// VALIDACIÓN DE NÚMEROS DE TELÉFONO (Argentina)
// ============================================

/**
 * Valida números de teléfono argentinos
 *
 * Formatos aceptados:
 * - +54 9 11 1234-5678 (con código de área 11)
 * - +54 9 341 123-4567 (con código de área 341)
 * - +54 11 1234-5678 (sin el 9)
 * - 11 1234-5678 (sin código de país)
 * - 341 123 4567 (con espacios)
 * - 3411234567 (sin separadores)
 *
 * Códigos de área:
 * - Buenos Aires (CABA): 11 (8 dígitos después)
 * - Resto de Argentina: 2-4 dígitos de código de área (6-8 dígitos después)
 */
export const validateArgentinianPhone = (phone: string): boolean => {
  // Remover todos los caracteres no numéricos para validación
  const digitsOnly = phone.replace(/\D/g, '');

  // Verificar longitud mínima (código de área + número)
  if (digitsOnly.length < 10) {
    return false;
  }

  // Patrón 1: Con código de país +54
  // +54 9 11 1234-5678 -> 5491112345678 (13 dígitos)
  // +54 9 341 123-4567 -> 549341123456 (12-13 dígitos)
  if (digitsOnly.startsWith('54')) {
    const withoutCountryCode = digitsOnly.slice(2);

    // Con prefijo móvil 9
    if (withoutCountryCode.startsWith('9')) {
      const withoutMobilePrefix = withoutCountryCode.slice(1);
      return withoutMobilePrefix.length >= 10 && withoutMobilePrefix.length <= 11;
    }

    // Sin prefijo móvil
    return withoutCountryCode.length >= 10 && withoutCountryCode.length <= 11;
  }

  // Patrón 2: Sin código de país
  // 11 1234-5678 -> 1112345678 (10 dígitos para CABA)
  // 341 123-4567 -> 3411234567 (10 dígitos para interior)
  if (digitsOnly.length >= 10 && digitsOnly.length <= 11) {
    return true;
  }

  return false;
};

/**
 * Formatea número de teléfono argentino para mostrar
 */
export const formatArgentinianPhone = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, '');

  // Si comienza con 54, formatear con código de país
  if (digitsOnly.startsWith('54')) {
    const withoutCountryCode = digitsOnly.slice(2);

    if (withoutCountryCode.startsWith('9')) {
      const withoutMobilePrefix = withoutCountryCode.slice(1);

      // Formato CABA: +54 9 11 1234-5678
      if (withoutMobilePrefix.startsWith('11')) {
        return `+54 9 11 ${withoutMobilePrefix.slice(2, 6)}-${withoutMobilePrefix.slice(6)}`;
      }

      // Formato interior: +54 9 341 123-4567
      const areaCode = withoutMobilePrefix.slice(0, 3);
      const number = withoutMobilePrefix.slice(3);
      return `+54 9 ${areaCode} ${number.slice(0, 3)}-${number.slice(3)}`;
    }
  }

  // Por defecto: devolver tal como está si no se puede formatear
  return phone;
};

// ============================================
// VALIDACIÓN DE NOMBRE COMPLETO
// ============================================

/**
 * Valida nombre completo (nombre y apellido)
 *
 * Requisitos:
 * - Al menos 2 palabras (nombre + apellido)
 * - Cada palabra mínimo 2 caracteres
 * - Solo letras, espacios, guiones y caracteres acentuados
 * - Sin números o caracteres especiales
 */
export const validateFullName = (name: string): boolean => {
  // Eliminar espacios y verificar si está vacío
  const trimmedName = name.trim();
  if (!trimmedName) {
    return false;
  }

  // Verificar caracteres inválidos (sin números, caracteres especiales excepto guión)
  const validCharactersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/;
  if (!validCharactersRegex.test(trimmedName)) {
    return false;
  }

  // Dividir por espacios y filtrar strings vacíos
  const words = trimmedName.split(/\s+/).filter(word => word.length > 0);

  // Debe tener al menos 2 palabras (nombre + apellido)
  if (words.length < 2) {
    return false;
  }

  // Cada palabra debe tener al menos 2 caracteres
  const allWordsValid = words.every(word => word.length >= 2);
  if (!allWordsValid) {
    return false;
  }

  return true;
};

/**
 * Formatea nombre completo: capitaliza primera letra de cada palabra
 */
export const formatFullName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// ============================================
// MENSAJES DE ERROR DE VALIDACIÓN
// ============================================

export const VALIDATION_MESSAGES = {
  phone: {
    invalid: 'Ingrese un número de teléfono argentino válido (ej: +54 341 123 4567 o 341 123 4567)',
    required: 'El teléfono es requerido',
    tooShort: 'El número de teléfono es demasiado corto',
  },
  name: {
    invalid: 'Ingrese nombre y apellido completos (ej: Juan Pérez)',
    required: 'El nombre es requerido',
    tooShort: 'Debe incluir nombre y apellido',
    invalidCharacters: 'Solo se permiten letras, espacios y guiones',
    minWords: 'Debe incluir al menos nombre y apellido',
  },
};

// ============================================
// REGLAS DE VALIDACIÓN PARA REACT HOOK FORM
// ============================================

/**
 * Reglas de validación para React Hook Form
 * Usar con la prop `rules`
 */
export const FORM_VALIDATION_RULES = {
  fullName: {
    required: VALIDATION_MESSAGES.name.required,
    validate: (value: string) => {
      if (!validateFullName(value)) {
        return VALIDATION_MESSAGES.name.invalid;
      }
      return true;
    },
  },
  argentinianPhone: {
    required: VALIDATION_MESSAGES.phone.required,
    validate: (value: string) => {
      if (!validateArgentinianPhone(value)) {
        return VALIDATION_MESSAGES.phone.invalid;
      }
      return true;
    },
  },
};
