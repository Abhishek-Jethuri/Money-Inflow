import React from "react";
import { CATEGORY_COLOR_OPTIONS } from "../../constants/constants";
import { useAppSelector } from "../../app/hooks";

const NetworkStatus: React.FC = () => {
  const isOnline = useAppSelector((state) => state.network.isOnline);

  return (
    !isOnline && (
      <div
        style={{
          background: CATEGORY_COLOR_OPTIONS[0],
          color: "white",
          padding: "10px",
          textAlign: "center",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        Houston, we have a problem! Internet signal is missing.
      </div>
    )
  );
};

export default NetworkStatus;
