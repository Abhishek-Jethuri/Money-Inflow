import React from "react";
import "./customRadio.scss";
import type { CustomRadioProps } from "./types";

const CustomRadio: React.FC<CustomRadioProps> = ({
  item,
  checked,
  onChange,
}) => {
  return (
    <>
      <input
        id={`radio-${item.label}`}
        className="radio-input"
        type="radio"
        value={item.id}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={`radio-${item.label}`} className="radio-label">
        {item.label}
      </label>
    </>
  );
};

const CustomRadioMemoized = React.memo(CustomRadio);
export default CustomRadioMemoized;
