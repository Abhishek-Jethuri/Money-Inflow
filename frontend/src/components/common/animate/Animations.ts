export type AnimationType = "diffuse" | "dropIn" | "jump" | "rightToLeft";

export const diffuse = {
  hidden: {
    y: -50,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    y: -50,
    opacity: 0,
  },
};
export const rightToLeft = {
  hidden: {
    x: 100,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      ease: "easeIn",
      duration: 0.15,
    },
  },
  exit: {
    x: 200,
    opacity: 0,
    transition: {
      ease: "easeOut",
      duration: 0.15,
    },
  },
};

export const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
  },
};

export const jump = {
  hidden: {
    opacity: 0,
    scale: 0.75,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: "easeOut",
      duration: 0.15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.75,
    transition: {
      ease: "easeIn",
      duration: 0.15,
    },
  },
};

export const animationVariants: Record<string, Record<string, unknown>> = {
  diffuse,
  rightToLeft,
  dropIn,
  jump,
};
