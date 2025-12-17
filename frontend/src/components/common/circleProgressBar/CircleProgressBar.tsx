import React from "react";
import "./circleProgressBar.scss";
import { motion } from "framer-motion";

interface CircleProgressBarProps {
  percentage: number;
  max: number;
  circleWidth: number;
}

const CircleProgressBar: React.FC<CircleProgressBarProps> = ({
  percentage,
  max,
  circleWidth,
}) => {
  const radius = 25;
  const viewBox = "-20 -20 70 70";
  const newPercentage = percentage / max;

  return (
    <motion.svg
      className="progress"
      viewBox={viewBox}
      initial={{ opacity: 0 }}
      animate={{
        opacity: newPercentage > 0 ? 1 : 0,
      }}
    >
      <circle
        cx={circleWidth / 2}
        cy={circleWidth / 2}
        r={radius}
        strokeWidth="10px"
        className="circle-background"
        pathLength="1"
      />
      <motion.circle
        cx={circleWidth / 2}
        cy={circleWidth / 2}
        r={radius}
        strokeWidth="10px"
        className="circle-progress"
        pathLength="1"
        transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: newPercentage > 0 ? newPercentage : 0,
          opacity: newPercentage > 0 ? 1 : 0,
        }}
      />
    </motion.svg>
  );
};

export default CircleProgressBar;
