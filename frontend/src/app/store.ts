import { configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import transactionReducer from "../features/transaction/transactionSlice";
import categoryReducer from "../features/category/categorySlice";
import accountReducer from "../features/account/accountSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import OverviewReducer from "../features/overview/overviewSlice";
import NetworkReducer from "../features/networkStatus/networkSlice";
import SettingReducer from "../features/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transaction: transactionReducer,
    category: categoryReducer,
    account: accountReducer,
    dashboard: dashboardReducer,
    overview: OverviewReducer,
    network: NetworkReducer,
    settings: SettingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
