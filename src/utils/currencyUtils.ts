import { Country } from "../components/pricing/CountrySelector";

export const convertPrice = (usdPrice: number, country: Country): string => {
  const convertedPrice = usdPrice * country.exchangeRate;

  // Format based on currency
  if (country.currency === "JPY") {
    // Japanese Yen doesn't use decimal places
    return `${country.currencySymbol}${Math.round(convertedPrice).toLocaleString("ja-JP")}`;
  } else if (country.currency === "INR") {
    // Indian Rupee formatting
    return `${country.currencySymbol}${Math.round(convertedPrice).toLocaleString("en-IN")}`;
  } else if (country.currency === "NGN") {
    // Nigerian Naira formatting - no decimal places for large amounts
    return `${country.currencySymbol}${Math.round(convertedPrice).toLocaleString("en-NG")}`;
  } else {
    // Most other currencies use 2 decimal places
    return `${country.currencySymbol}${convertedPrice.toFixed(2)}`;
  }
};

export const formatCurrency = (amount: number, country: Country): string => {
  return convertPrice(amount, country);
};

export const getCurrencySymbol = (country: Country): string => {
  return country.currencySymbol;
};
