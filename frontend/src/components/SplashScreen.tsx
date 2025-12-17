import React from "react";
import "./SplashScreen.scss";

interface SplashScreenProps {
  message?: string;
  isLoading?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  message = "Loading...",
  isLoading = true,
}) => {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="brand-container">
          <h1 className="brand-title">
            <span className="brand-money">Money</span>
            <span className="brand-inflow">Inflow</span>
          </h1>
          <div className="brand-subtitle">Expense Tracking</div>
        </div>

        {isLoading && (
          <div className="loading-container">
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            {message && <p className="loading-message">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
