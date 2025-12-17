import { Link } from "react-router-dom";
import "./header.scss";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout, reset } from "../../features/auth/authSlice";
import {
  getDashboard,
  setDateRange,
} from "../../features/dashboard/dashboardSlice";
import DateRangePicker from "../../components/common/datePicker/DateRangePicker";
import React from "react";
import { settingsReset } from "../../features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Header: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const globalStartDate = useAppSelector((state) => state.dashboard.startDate);
  const globalEndDate = useAppSelector((state) => state.dashboard.startDate);

  const [startDate, setStartDate] = useState<Date | null>(globalStartDate);
  const [endDate, setEndDate] = useState<Date | null>(globalEndDate);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setStartDate(globalStartDate);
    setEndDate(globalEndDate);
  }, [globalStartDate, globalEndDate]);

  const onLogout = () => {
    const userData = {
      userId: user?._id,
    };
    dispatch(logout(userData));
    dispatch(settingsReset());
    dispatch(reset());
    navigate("/login");
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    dispatch(setDateRange({ startDate: start, endDate: end }));
  };

  const handleDateSubmit = () => {
    const date = {
      startDate: startDate,
      endDate: endDate || startDate,
    };
    if (startDate !== undefined && endDate !== undefined) {
      dispatch(setDateRange(date));
      dispatch(getDashboard({ startDate, endDate: endDate || startDate }));
    }
  };

  const getMenuTitle = () => {
    const path = location.pathname.split("/")[1];
    if (path === "") return "Home";
    if (path === "overview" && location.pathname.split("/")[2]) return null;
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const menuTitle = getMenuTitle();

  return (
    <div className="header-container">
      <div className="page-heading">
        <span>{menuTitle}</span>
      </div>
      {user ? (
        <div className="header-actions-container">
          {(menuTitle === "Home" || menuTitle === "Overview") && (
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
              onDateSubmit={handleDateSubmit}
            />
          )}
          <button className="btn" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      ) : (
        <div className="header-actions-container">
          <Link to="/login">
            <FaSignInAlt /> Login
          </Link>
          <Link to="/register">
            <FaUser /> Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
