import "./App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/home/Home";
import Categories from "./pages/categories/Categories";
import Wallets from "./pages/wallets/Wallets";
import Transactions from "./pages/transactions/Transactions";
import Overview from "./pages/overview/Overview";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/rootLayout/RootLayout";
import Register from "./pages/register/Register";
import NetworkStatus from "./components/networkStatus/NetworkStatus";
import ProtectedRoute from "./app/ProtectedRoute";
import Settings from "./components/settings/Settings";
import OverviewItem from "./components/overview/overviewItem/OverviewItem";
import Login from "./pages/login/Login";

function App() {
  return (
    <>
      <div>
        <NetworkStatus />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              {/* Public Routes */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route index element={<Home />} />
                <Route path="categories" element={<Categories />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="wallets" element={<Wallets />} />
                <Route path="overview" element={<Overview />} />
                <Route path="overview/:userId" element={<OverviewItem />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
