import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PiReceiptLight } from "react-icons/pi";
import { MdAddCircleOutline } from "react-icons/md";
import "./NoTransactions.scss";
import DateRangePicker from "../../components/common/datePicker/DateRangePicker";
import { setDateRange } from "../../features/dashboard/dashboardSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface NoTransactionsViewProps {
  onAddTransaction: () => void;
}

const NoTransactionsView: React.FC<NoTransactionsViewProps> = ({
  onAddTransaction,
}) => {
  const globalStartDate = useAppSelector((state) => state.dashboard.startDate);
  const globalEndDate = useAppSelector((state) => state.dashboard.endDate);

  const [startDate, setStartDate] = useState<Date | null>(globalStartDate);
  const [endDate, setEndDate] = useState<Date | null>(globalEndDate);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setStartDate(globalStartDate);
    setEndDate(globalEndDate);
  }, [globalStartDate, globalEndDate]);

  const formatDate = (date: Date | null) => {
    if (!date) return "all time";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    dispatch(setDateRange({ startDate: start, endDate: end }));
  };

  const handleDateSubmit = () => {
    const date = {
      startDate: startDate,
      endDate: endDate || startDate,
    };

    if (startDate !== undefined && endDate !== undefined) {
      dispatch(setDateRange(date));
    }
  };

  return (
    <motion.div
      className="no-transactions-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="no-transactions-content">
        <div className="no-transactions-icon">
          <PiReceiptLight />
        </div>
        <h2>Your Wallet is in Zero Gravity</h2>
        <p>
          {startDate && endDate
            ? `There are no transactions between ${formatDate(
                startDate
              )} and ${formatDate(endDate)}.`
            : "You haven't recorded any transactions yet."}
        </p>
        <div className="actions-container">
          <motion.button
            className="btn-primary rounded-md"
            onClick={onAddTransaction}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdAddCircleOutline fontSize={20} />
            {startDate && endDate ? `Add Transaction` : "Add First Transaction"}
          </motion.button>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            onDateSubmit={handleDateSubmit}
          />
        </div>

        <div className="tips-section">
          <h5>Quick Tips</h5>
          <ul>
            <li>
              <span>🚀 </span>
              <h3>Start tracking your finances today</h3>
            </li>
            <li>
              <span>💡 </span>
              <h3>Every transaction counts, big or small</h3>
            </li>
            <li>
              <span>📊 </span>
              <h3>Get insights into your spending habits</h3>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default NoTransactionsView;
