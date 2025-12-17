import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import {
  updateProfile,
  getProfile,
} from "../../features/settings/settingsSlice";
import { toast } from "react-toastify";
import currencyCodes from "currency-codes";
import getSymbolFromCurrency from "currency-symbol-map";
import "./settings.scss";
import Spinner from "../common/spinner/Spinner";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string | undefined;
}

const Settings = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { profile, isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.settings
  );

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [currentCurrency, setCurrentCurrency] = useState<string>(
    user?.profile?.currency || "USD"
  );
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);

  useEffect(() => {
    dispatch(getProfile());
  }, [user?._id, dispatch]);

  useEffect(() => {
    if (profile?.currency) setCurrentCurrency(profile.currency);
  }, [profile?.currency]);

  useEffect(() => {
    const uniqueCurrencies = currencyCodes.data
      .filter(
        (item, index, self) =>
          index === self.findIndex((c) => c.code === item.code)
      )
      .map((cur) => ({
        code: cur.code,
        name: cur.currency,
        symbol: getSymbolFromCurrency(cur.code),
      }))
      .sort((a, b) => a.code.localeCompare(b.code));

    setCurrencyOptions(uniqueCurrencies);
  }, []);

  useEffect(() => {
    if (isError) toast.error(message);
  }, [isError, isSuccess, message, dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = e.target.value;
    setCurrentCurrency(selectedCurrency);
    if (user?._id) dispatch(updateProfile({ currency: selectedCurrency }));
  };

  if (isLoading) {
    return (
      <div className="settings-container">
        <div className="settings-card">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>Profile Settings</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="currency">Preferred Currency</label>
            <select
              name="currency"
              id="currency"
              value={currentCurrency}
              onChange={handleCurrencyChange}
            >
              {currencyOptions.map(({ code, name, symbol }) => (
                <option key={code} value={code}>
                  {code} {symbol ? `(${symbol})` : ""} — {name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
