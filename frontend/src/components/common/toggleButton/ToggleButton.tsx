import React from "react";
import CustomRadio from "./CustomRadio";
import "./toggleButton.scss";
import { TYPES } from "../../../constants/constants";
import type { ToggleButtonProps } from "./types";

const ToggleButton: React.FC<ToggleButtonProps> = ({
  items,
  value,
  onChange,
}) => (
  <div className="toggle-btn-list">
    <div
      id="btn"
      style={value === TYPES.EXPENSE ? { left: "3%" } : { left: "53%" }}
    ></div>
    {items.map((item) => (
      <CustomRadio
        item={item}
        key={item.id}
        checked={item.id === value}
        onChange={onChange}
      />
    ))}
  </div>
);

const ToggleButtonMemoized = React.memo(ToggleButton);
export default ToggleButtonMemoized;
