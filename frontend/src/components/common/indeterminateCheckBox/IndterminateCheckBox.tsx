import React, { useEffect, useRef } from "react";

interface IndeterminateCheckboxProps {
  indeterminate?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

const IndeterminateCheckbox: React.FC<IndeterminateCheckboxProps> = ({
  indeterminate,
  ...rest
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <label className="checkbox-container">
      <input ref={ref} {...rest} type="checkbox" />
      <span className="checkmark"></span>
    </label>
  );
};

export default IndeterminateCheckbox;
