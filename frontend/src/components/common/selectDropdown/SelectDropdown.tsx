import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./SelectDropDown.scss";

interface Option {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  onChange: (newValue: Option) => void;
  placeholder?: string;
  value: Option | null;
  options: Option[];
  label?: string;
  size?: "sm" | "md" | "lg" | "fw";
  isGrid?: boolean;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  onChange,
  placeholder = "Select",
  value,
  options,
  label,
  size,
  isGrid,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const displayValue = value?.label || placeholder;

  return (
    <div className="select-outerContainer">
      {label && <label htmlFor="category">{label}</label>}
      <div
        className={`select-container ${
          size === "sm" ? "select-sm" : size === "fw" ? "select-fw" : ""
        }`}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          tabIndex={0}
          className="select-wrapper"
          role="button"
        >
          <div>{displayValue}</div>
          <MdKeyboardArrowDown className={open ? "rotate-logo" : ""} />
        </div>

        {open && (
          <div
            onClick={(e) => e.stopPropagation()}
            ref={dropdownRef}
            className={`options-container ${isGrid ? "options-container-grid" : ""}`}
          >
            {options.length > 0 ? (
              options.map((option, id) => (
                <div
                  key={id}
                  className={`option-wrapper ${
                    value && option.value === value.value
                      ? "option-background"
                      : ""
                  }`}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <div
                    className={
                      value && option.value === value.value ? "option" : ""
                    }
                  >
                    {option.label}
                  </div>
                </div>
              ))
            ) : (
              <div>--Please add items--</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDropdown;
