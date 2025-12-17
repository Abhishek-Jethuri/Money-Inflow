import React from "react";
import { motion, type Variants } from "framer-motion";
import "./Spinner.scss";

const Spinner: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const ringVariants: Variants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const pulseVariants: Variants = {
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="spinner-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="spinner-wrapper">
        <motion.div
          className="spinner-ring"
          variants={ringVariants}
          animate="animate"
        >
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray="88"
              strokeDashoffset="22"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </div>
      <motion.div
        className="spinner-text"
        variants={pulseVariants}
        animate="animate"
      >
        Loading...
      </motion.div>
    </motion.div>
  );
};

export default Spinner;
