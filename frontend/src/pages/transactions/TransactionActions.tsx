import React from "react";
import { MdDelete } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

interface TransactionActionsProps {
  selectedRows: string[];
  onDeleteSelected: () => void;
}

const TransactionActions: React.FC<TransactionActionsProps> = ({
  selectedRows,
  onDeleteSelected,
}) => (
  <AnimatePresence>
    {selectedRows.length > 0 ? (
      <motion.div
        initial={{ x: 50, opacity: 0, height: 0 }}
        animate={{ x: 0, opacity: 1, height: "auto" }}
        transition={{ duration: 1 }}
        key="delete"
        exit={{
          x: 50,
          opacity: 0,
          transition: { duration: 1 },
          height: 0,
        }}
      >
        <button
          className="btn btn-secondary"
          style={{ padding: "8px 10px", marginBottom: "1rem" }}
          onClick={onDeleteSelected}
        >
          <div className="transaction-delete-container">
            <MdDelete
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                fontSize: "20px",
                color: "var(--purple-100)",
              }}
            />
            <span>Delete</span>
          </div>
        </button>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

export default TransactionActions;
