import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./MultiSelectDropDown.scss";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectValue {
  [key: string]: boolean;
}

interface MultiSelectDropdownProps {
  onChange: (newValue: MultiSelectValue) => void;
  placeholder?: string;
  value: MultiSelectValue | null;
  options: Option[];
  label?: string;
  size?: "sm" | "md" | "lg" | "fw";
  isGrid?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
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
    const initialValue = options.reduce<MultiSelectValue>(
      (obj, option) => ({
        ...obj,
        [option.label]: false,
      }),
      {}
    );
    onChange(initialValue);

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
  }, [options, onChange]);

  const numberOfOptionsSelected = value
    ? Object.values(value).filter(Boolean).length
    : 0;

  const displayValue =
    numberOfOptionsSelected > 0
      ? `${numberOfOptionsSelected} selected`
      : placeholder;

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
                <div key={id} className={`option-wrapper`}>
                  {
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        id={`input-${option.label}`}
                        checked={value ? value[option.label] : false}
                        onChange={(e) =>
                          onChange({
                            ...value,
                            [option.label]: e.target.checked,
                          })
                        }
                      />
                      <span className="checkmark"></span>
                    </label>
                  }
                  <div>{option.label}</div>
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

export default MultiSelectDropdown;
