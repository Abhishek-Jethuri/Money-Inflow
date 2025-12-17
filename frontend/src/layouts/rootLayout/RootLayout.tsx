import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import "../layout.scss";
import Header from "../header/Header";
import { SidebarData } from "../../data/sidebar";
import SidebarOption from "./SidebarOption";
import { AiOutlineMenu } from "react-icons/ai";
// import useScrollToTop from "../../hooks/useScrollToTop";

export default function RootLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // useScrollToTop();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className={`root-layout ${isAuthPage ? "auth-page" : ""}`}>
      {!isAuthPage && (
        <button className="menu-toggle-btn" onClick={toggleSidebar}>
          <AiOutlineMenu />
        </button>
      )}

      {!isAuthPage && (
        <div className={`root-layout-nav ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-top">
            <span className="logo money">Money</span>
            <span className="logo inflow">Inflow</span>
          </div>

          <nav>
            {SidebarData.map((option) => {
              return (
                <NavLink
                  key={option.id}
                  to={option.to}
                  className="sidebar-center"
                  onClick={closeSidebar}
                >
                  {({ isActive }) => (
                    <>
                      <SidebarOption
                        key={option.id}
                        option={option}
                        isActive={isActive}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}

      <main className={isAuthPage ? "auth-main" : ""}>
        {!isAuthPage && <Header />}
        <Outlet />
      </main>
      <div
        id="date-picker-portal"
        className="portal-container"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "#f3f3f3",
        }}
      ></div>
    </div>
  );
}
