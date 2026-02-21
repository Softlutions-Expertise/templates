import parsePhoneNumberFromString from "libphonenumber-js";

export const fmtKeepOnlyNumbers = (data: unknown) => {
  if (typeof data === "number") {
    return `${data}`;
  }

  if (typeof data === "string") {
    return data.replace(/\D/g, "");
  }

  return "";
};

export const fmtMaskCpf = (
  rawCpf: unknown,
  anonymize: boolean | null | undefined = false
) => {
  const cleanCpf = fmtKeepOnlyNumbers(rawCpf);

  if (cleanCpf.length > 0) {
    const part1 = cleanCpf.slice(0, 3);
    const part2 = cleanCpf.slice(3, 6);
    const part3 = cleanCpf.slice(6, 9);
    const part4 = cleanCpf.slice(9, 11);

    if (anonymize) {
      return `${part1}.XXX.XXX-XX`;
    }

    return `${part1}.${part2}.${part3}-${part4}`;
  }

  return "";
};

export const fmtPluralize =
  (singular: string, plural: string) => (count: number) => {
    return count === 1 ? singular : plural;
  };

export const fmtSuffixPlural = (singular: string, plural: string) => {
  const pluralize = fmtPluralize(singular, plural);

  return (count: number) => {
    const suffix = pluralize(count);
    return `${count} ${suffix}`;
  };
};

export const fmtSuffixPluralDays = (count: number) => {
  return fmtSuffixPlural("dia", "dias")(count);
};

export const fmtPersonNameAnonymized = (name: unknown) => {
  if (typeof name === "string") {
    return name
      .split(" ")
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .map((part) => `${part[0].toUpperCase()}.`)
      .join(" ");
  }

  return "";
};

export const fmtPersonName = (
  name: unknown,
  anonymize: boolean | null | undefined = false
) => {
  if (typeof name === "string") {
    if (anonymize) {
      return fmtPersonNameAnonymized(name);
    }

    return name;
  }

  return "";
};

export const fmtMaskPhone = (
  data: unknown,
  anonymizeData: boolean | undefined | null = false
) => {
  if (typeof data === "string") {
    if (anonymizeData) {
      return "(**) ***";
    }

    const parse = parsePhoneNumberFromString(data, {
      defaultCountry: "BR",
      defaultCallingCode: "55",
    });

    return parse?.formatNational() ?? "";
  }

  return "";
};

export const fmtMask = (data: string | undefined, format: "cpf" | "phone") => {
  switch (format) {
    case "cpf": {
      return fmtMaskCpf(data);
    }

    case "phone": {
      return fmtMaskPhone(data);
    }

    default: {
      throw new Error("invalid format");
    }
  }
};

export const fmtGrupoPreferencialOrdinal = (
  posicao: number,
  subPosicao: number | null | undefined
) => {
  return `${[posicao, subPosicao].filter(Boolean).join(".")}º`;
};

export const fmtEnumerable = (items: any[], many = ", ", final = " e ") => {
  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return items.join(final);
  }

  if (items.length > 2) {
    const itemsMany = items.slice(0, -1);
    const itemLast = items[items.length - 1];
    return `${itemsMany.join(many)} ${final} ${itemLast}`;
  }

  return "";
};

export const fmtDate = (
  data: string | undefined | null,
  format: "date-time" | "date" | "time" = "date-time"
) => {
  if (typeof data === "string") {
    const date = new Date(data);
    const formattedDate = date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (format === "date") {
      return formattedDate;
    }

    if (format === "time") {
      return `${hours}h${minutes}`;
    }

    return `${formattedDate} às ${hours}h${minutes}`;
  }

  return "-";
};
