// src/utils/phoneUtils.ts
export const formatPhone = (value: string): string => {
  // Remove tudo que não é dígito
  const cleaned = value.replace(/\D/g, "");

  // Limita a 11 caracteres (DDD + 9 dígitos)
  const limited = cleaned.slice(0, 11);

  // Aplica a máscara: (XX) XXXXX-XXXX
  if (limited.length <= 2) {
    return limited;
  }
  if (limited.length <= 7) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  }
  return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(
    7,
    11
  )}`;
};

export const cleanPhone = (value: string): string => {
  return value.replace(/\D/g, "");
};
