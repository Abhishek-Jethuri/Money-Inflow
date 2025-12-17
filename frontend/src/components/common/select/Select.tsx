import React, { useEffect, useRef, useState } from "react";
import "./select.scss";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface SelectProps {
  options: string[];
}

const Select: React.FC<SelectProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>(
    options.reduce(
      (obj, option) => ({
        ...obj,
        [option]: false,
      }),
      {}
    )
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.target !== dropdownRef.current) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  const numberOfOptionsSelected =
    Object.values(selected).filter(Boolean).length;

  return (
    <fieldset className="state-dropdown">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prevState) => !prevState);
        }}
      >
        {numberOfOptionsSelected > 0
          ? `${numberOfOptionsSelected} selected`
          : "Select"}

        {!isOpen ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
      </button>
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          ref={dropdownRef}
          className="panel"
        >
          {options.map((option, ind) => {
            return (
              <fieldset
                key={ind}
                className={selected[option] ? `selected` : ""}
              >
                <input
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      [option]: e.target.checked,
                    })
                  }
                  checked={selected[option]}
                  id={`input-${option}`}
                  type="checkbox"
                />
                <label htmlFor={`input-${option}`}>{option}</label>
              </fieldset>
            );
          })}
        </div>
      )}
    </fieldset>
  );
};

export default Select;
