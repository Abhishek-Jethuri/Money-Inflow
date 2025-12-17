import React, { type ReactNode } from "react";
import "./card.scss";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`cards ${className}`}>{children}</div>;
};

export default Card;
