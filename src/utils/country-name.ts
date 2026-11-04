import { Country } from "country-state-city";

// Organisations created at sign-up store the country as a 2-letter ISO code
// (e.g. "za"), while the organisation forms store the full name. Return the
// name in both cases.
export const getCountryName = (country?: string | null): string => {
  const value = country?.trim() ?? "";

  if (/^[a-z]{2}$/i.test(value)) {
    const code = value.toUpperCase();
    return Country.getCountryByCode(code)?.name ?? code;
  }

  return value;
};
