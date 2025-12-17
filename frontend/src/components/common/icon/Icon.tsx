import React from "react";

interface IconProps {
  color?: string;
  size?: number;
  icon: string;
  label?: string;
}

const Icon: React.FC<IconProps> = ({ color, size = 24, icon }) => {
  const styles = {
    svg: {
      display: "inline-block",
      verticalAlign: "middle",
    },
    path: {
      fill: color,
    },
  };

  return (
    <svg
      style={styles.svg}
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 24 24"
    >
      <path style={styles.path} d={icon}></path>
    </svg>
  );
};

export default Icon;
