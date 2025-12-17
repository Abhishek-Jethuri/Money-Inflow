import currency from "currency.js";
import getSymbolFromCurrency from "currency-symbol-map";
import currencyCodes from "currency-codes";
import { useMemo, useCallback } from "react";
import { useAppSelector } from "../app/hooks";

interface CurrencyOptions {
  symbol: string;
  precision: number;
}

const getCurrencyOptions = (code: string): CurrencyOptions => {
  const fallback: CurrencyOptions = { symbol: "$", precision: 2 };

  const symbol = getSymbolFromCurrency(code) || fallback.symbol;
  const meta = currencyCodes.code(code);
  const precision = meta?.code === "JPY" ? 0 : 2;

  return {
    symbol,
    precision,
  };
};

export const formatCurrency = (
  amount: number,
  currencyCode: string = "USD"
): string => {
  const options = getCurrencyOptions(currencyCode);
  return currency(amount, options).format();
};

export const useCurrency = () => {
  const currency = useAppSelector((state) => state.settings.profile.currency);
  const currencyCode = currency || "USD";
  const options = useMemo(
    () => getCurrencyOptions(currencyCode),
    [currencyCode]
  );
  const format = useCallback(
    (amount: number) => formatCurrency(amount, currencyCode),
    [currencyCode]
  );

  return {
    currency: currencyCode,
    symbol: options.symbol,
    format,
  };
};
