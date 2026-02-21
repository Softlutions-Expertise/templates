// ----------------------------------------------------------------------

import { fNumber } from "@softlutions/utils";

export const fNumber3 = (value: any): number => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  
  const stringValue = value.toString();
  const cleaned = stringValue.replace(/[^\d.,]/g, '');
  const normalized = cleaned.replace(/\./g, '').replace(',', '.');
  const result = parseFloat(normalized);
  
  return isNaN(result) ? 0 : result;
};

export type MaskType = {
  cep: any;
  cnpj: any;
  cpf: any;
  cpfOrCnpj: any;
  kg: any;
  money: any;
  money3: any;
  number: any;
  numberZeroLeft: any;
  unmasked: any;
  percentage: any;
  telefoneCelular: any;
  telefoneComercial: any;
  time: any;
  chaveAcessoReferenciada: any;
};

export const MAX_LENGTHS_MASK = {
  cpf: 11,
  cnpj: 14,
  cep: 8,
  telefoneCelular: 11,
  telefoneComercial: 11,
  time: 4,
  chaveAcessoReferenciada: 44,
};

const unmasked = (value = '') => {
  if (value === undefined || value === null) return '';

  return value?.toString().replace(/[^a-zA-Z0-9]/g, '');
};

const cpf = (value = '') => {
  if (value === undefined || value === null) return '';

  const maxLength = MAX_LENGTHS_MASK.cpf;

  let numericValue = value.replace(/\D/g, '');

  if (numericValue.length > maxLength) {
    numericValue = numericValue.slice(0, maxLength);
  }

  let maskedValue = '';

  if (numericValue.length > 3) {
    maskedValue = `${numericValue.substring(0, 3)}.${numericValue.substring(3)}`;

    if (numericValue.length > 6) {
      maskedValue = `${maskedValue.substring(0, 7)}.${maskedValue.substring(7)}`;

      if (numericValue.length > 9) {
        maskedValue = `${maskedValue.substring(0, 11)}-${maskedValue.substring(11)}`;
      }
    }
  } else {
    maskedValue = numericValue;
  }

  return maskedValue;
};

export const telefoneCelular = (value = '') => {
  if (value === undefined || value === null) return '';

  const maxLength = MAX_LENGTHS_MASK.telefoneCelular;

  let numericValue = value.replace(/\D/g, '');

  if (numericValue.length > maxLength) {
    numericValue = numericValue.slice(0, maxLength);
  }

  let maskedValue = '';

  if (numericValue.length >= 1) {
    maskedValue = `(${numericValue.substring(0)}`;

    if (numericValue.length > 2) {
      maskedValue = `${maskedValue.substring(0, 3)}) ${maskedValue.substring(3)}`;

      if (numericValue.length > 7) {
        maskedValue = `${maskedValue.substring(0, 10)}-${maskedValue.substring(10)}`;
      }
    }
  }

  return maskedValue;
};

export const telefoneComercial = (value = '') => {
  if (value === undefined || value === null) return '';

  const maxLength = MAX_LENGTHS_MASK.telefoneComercial;

  let numericValue = value.replace(/\D/g, '');

  if (numericValue.length > maxLength) {
    numericValue = numericValue.slice(0, maxLength);
  }

  let maskedValue = '';

  if (numericValue.length > 0) {
    maskedValue = `(${numericValue.substring(0, 2)}`;

    if (numericValue.length > 2) {
      maskedValue += `) ${numericValue.substring(2, 6)}`;

      if (numericValue.length > 6) {
        maskedValue += `-${numericValue.substring(6, 10)}`;
      }

      if (numericValue.length === 11) {
        maskedValue = `(${numericValue.substring(0, 2)}) ${numericValue.substring(2, 7)}-${numericValue.substring(7, 11)}`;
      }
    }
  }

  return maskedValue;
};

const cep = (value = '') => {
  if (value === undefined || value === null) return '';

  const maxLength = MAX_LENGTHS_MASK.cep;

  let numericValue = value.replace(/\D/g, '');

  if (numericValue.length > maxLength) {
    numericValue = numericValue.slice(0, maxLength);
  }

  let maskedValue = '';

  if (numericValue.length > 5) {
    maskedValue = `${numericValue.substring(0, 5)}-${numericValue.substring(5)}`;
  } else {
    maskedValue = numericValue;
  }

  return maskedValue;
};

const cnpj = (value = '') => {
  if (value === undefined || value === null) return '';

  const maxLength = MAX_LENGTHS_MASK.cnpj;

  let numericValue = value.replace(/\D/g, '');

  if (numericValue.length > maxLength) {
    numericValue = numericValue.slice(0, maxLength);
  }

  let maskedValue = '';

  if (numericValue.length > 2) {
    maskedValue = `${numericValue.substring(0, 2)}.${numericValue.substring(2)}`;

    if (numericValue.length > 5) {
      maskedValue = `${maskedValue.substring(0, 6)}.${maskedValue.substring(6)}`;

      if (numericValue.length > 8) {
        maskedValue = `${maskedValue.substring(0, 10)}/${maskedValue.substring(10)}`;

        if (numericValue.length > 12) {
          maskedValue = `${maskedValue.substring(0, 15)}-${maskedValue.substring(15)}`;
        }
      }
    }
  } else {
    maskedValue = numericValue;
  }

  return maskedValue;
};

const number = (value = '') => {
  if (value === undefined || value === null) return '';

  if (value?.toString() === '0') return 0;

  if (!value) return '';

  const numericalValue = value.toString().replace(/[^0-9.-]/g, '');
  const parsedNumber = parseFloat(numericalValue);
  return isNaN(parsedNumber) ? '' : parsedNumber;
};

const percentage = (value: string | number, type?: 'real') => {
  const convert = (type ? fNumber('money', value) : value)?.toString().replace(/\D/g, '');
  const valueInCents = parseFloat(convert) / 100;
  if (!isNaN(valueInCents)) {
    if (type === 'real') {
      const valueInCents = parseFloat(convert) / 100;
      return valueInCents.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
      });
    } else {
      return valueInCents.toLocaleString('pt-br', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  } else {
    return '';
  }
};

const money = (value: string | number, type?: 'real') => {
  const convert = (type ? fNumber('money', value) : value)?.toString().replace(/\D/g, '');
  const valueInCents = parseFloat(convert) / 100;
  if (!isNaN(valueInCents)) {
    if (type === 'real') {
      const valueInCents = parseFloat(convert) / 100;
      return valueInCents.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
      });
    } else {
      return valueInCents.toLocaleString('pt-br', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  } else {
    return '';
  }
};

const money3 = (value: string | number, type?: 'real') => {
  if (value === null || value === undefined || value === '') return '';
  
  let convert: string;
  
  if (typeof value === 'number') {
    convert = Math.round(value * 1000).toString();
  } else {
    convert = value.toString().replace(/\D/g, '');
  }
  
  if (!convert) return '';
  
  const valueInThousands = parseFloat(convert) / 1000;
  
  if (!isNaN(valueInThousands)) {
    if (type === 'real') {
      return valueInThousands.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    } else {
      return valueInThousands.toLocaleString('pt-br', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    }
  } else {
    return '';
  }
};

const kg = (value = '', type?: 'kg') => {
  const convert = value?.toString().replace(/\D/g, '');
  const valueInKg = parseFloat(convert) / 1000;
  if (!isNaN(valueInKg)) {
    if (type === 'kg') {
      return (
        valueInKg.toLocaleString('pt-br', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        }) + ' kg'
      );
    } else {
      return valueInKg.toLocaleString('pt-br', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    }
  } else {
    return '';
  }
};

const time = (value = '') => {
  if (value === undefined || value === null) return '';

  if (!value) return '';

  let numericValue = value.replace(/\D/g, '');

  if (numericValue.length > MAX_LENGTHS_MASK.time) {
    numericValue = numericValue.slice(0, MAX_LENGTHS_MASK.time);
  }

  let maskedValue = '';

  if (numericValue.length > 2) {
    maskedValue = `${numericValue.substring(0, 2)}:${numericValue.substring(2)}`;
  } else {
    maskedValue = numericValue;
  }

  return maskedValue;
};

// ----------------------------------------------------------------------

export const cpfOrCnpj = (value = '') => {
  if (value === undefined || value === null) return '';

  if (!value) return '';

  let numericValue = value?.replace(/\D/g, '');
  let maskedValue = '';

  if (numericValue.length <= MAX_LENGTHS_MASK.cpf) {
    // CPF
    if (numericValue.length > MAX_LENGTHS_MASK.cpf) {
      numericValue = numericValue.slice(0, MAX_LENGTHS_MASK.cpf);
    }

    if (numericValue.length > 3) {
      maskedValue = `${numericValue.substring(0, 3)}.${numericValue.substring(3)}`;

      if (numericValue.length > 6) {
        maskedValue = `${maskedValue.substring(0, 7)}.${maskedValue.substring(7)}`;

        if (numericValue.length > 9) {
          maskedValue = `${maskedValue.substring(0, 11)}-${maskedValue.substring(11)}`;
        }
      }
    } else {
      maskedValue = numericValue;
    }
  } else {
    // CNPJ
    if (numericValue.length > MAX_LENGTHS_MASK.cnpj) {
      numericValue = numericValue.slice(0, MAX_LENGTHS_MASK.cnpj);
    }

    if (numericValue.length > 2) {
      maskedValue = `${numericValue.substring(0, 2)}.${numericValue.substring(2)}`;

      if (numericValue.length > 5) {
        maskedValue = `${maskedValue.substring(0, 6)}.${maskedValue.substring(6)}`;

        if (numericValue.length > 8) {
          maskedValue = `${maskedValue.substring(0, 10)}/${maskedValue.substring(10)}`;

          if (numericValue.length > 12) {
            maskedValue = `${maskedValue.substring(0, 15)}-${maskedValue.substring(15)}`;
          }
        }
      }
    } else {
      maskedValue = numericValue;
    }
  }

  return maskedValue;
};

const numberZeroLeft = (value = '') => {
  if (value === undefined || value === null) return '';

  if (!value) return '';

  return value.toString().replace(/[^0-9]/g, '');
};

export const chaveAcessoReferenciada = (value = '') => {
  if (value === undefined || value === null) return '';

  if (!value) return '';

  let numericValue = value.replace(/\D/g, '');

  if (numericValue.length > MAX_LENGTHS_MASK.chaveAcessoReferenciada) {
    numericValue = numericValue.slice(0, MAX_LENGTHS_MASK.chaveAcessoReferenciada);
  }

  let maskedValue = '';
  for (let i = 0; i < numericValue.length; i++) {
    if (i > 0 && i % 4 === 0) {
      maskedValue += ' ';
    }
    maskedValue += numericValue[i];
  }

  return maskedValue;
};

export const mask: MaskType = {
  cep,
  cnpj,
  cpf,
  cpfOrCnpj,
  kg,
  money,
  money3,
  number,
  numberZeroLeft,
  percentage,
  telefoneCelular,
  telefoneComercial,
  time,
  chaveAcessoReferenciada,
  unmasked,
};