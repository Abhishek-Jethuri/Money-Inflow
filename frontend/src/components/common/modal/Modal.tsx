import React, {
  useEffect,
  useContext,
  createContext,
  type ReactNode,
} from "react";
import "./Modal.css";
import { motion, type Variants } from "framer-motion";
import type { AnimationType } from "../animate/Animations";
import { animationVariants } from "../animate/Animations";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  isRight?: boolean;
  animate: AnimationType; // Typed animate prop
}

interface ModalContextType {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

interface DismissButtonProps {
  children: ReactNode;
  className?: string;
}

interface ModalHeaderProps {
  children: ReactNode;
}

interface ModalBodyProps {
  children: ReactNode;
  isRight?: boolean;
}

interface ModalFooterProps {
  children: ReactNode;
}

const DismissButton: React.FC<DismissButtonProps> = ({
  children,
  className,
}) => {
  const context = useContext(ModalContext);
  const onClose = context?.onClose;

  return (
    <button type="button" className={className} onClick={onClose}>
      {children}
    </button>
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ children }) => {
  return (
    <div className="react-modal-header">
      <div className="react-modal-title">{children}</div>
    </div>
  );
};

const ModalBody: React.FC<ModalBodyProps> = ({ children, isRight }) => {
  return (
    <>
      {!isRight && (
        <div className="btn-close-container">
          <DismissButton className="btn-close">&times;</DismissButton>
        </div>
      )}
      <div className="react-modal-body">{children}</div>
    </>
  );
};

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => {
  return <div className="react-modal-footer">{children}</div>;
};

const ModalComponent: React.FC<ModalProps> = ({
  children,
  isOpen: _isOpen,
  onClose,
  isRight,
  animate,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const selectedVariant = (animationVariants[animate] || undefined) as
    | Variants
    | undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="react-modal-overlay"
    >
      <motion.div
        variants={selectedVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`react-modal-wrapper ${isRight ? "modal-wrapper-right" : ""}`}
      >
        <div
          className={`react-modal-content  ${isRight ? "modal-content-right" : ""}`}
        >
          <ModalContext.Provider value={{ onClose }}>
            {children}
          </ModalContext.Provider>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Modal = Object.assign(ModalComponent, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  DismissButton: DismissButton,
});

export default Modal;
