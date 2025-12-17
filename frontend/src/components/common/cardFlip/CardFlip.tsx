import React from "react";
import "./cardFlip.scss";
import { motion } from "framer-motion";

interface CardFlipProps {
  isFlipped: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
}

const CardFlip: React.FC<CardFlipProps> = ({ isFlipped, front, back }) => {
  return (
    <motion.div
      className="flip-card-inner"
      style={{ width: "100%", height: "50%" }}
      initial={false}
      animate={{ rotateY: isFlipped ? 180 : 360 }}
      transition={{ duration: 0.1 }}
    >
      <div className="flip-card-front">{front}</div>
      <div className="flip-card-back">{back}</div>
    </motion.div>
  );
};

export default CardFlip;
