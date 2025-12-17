import React from "react";
import AddExpense from "../addExpense/addExpense";
import { AnimatePresence } from "framer-motion";
import { Widget } from "../../common/widget/Widget";
import { ACTIONS } from "../../../constants/constants";
import type { WidgetsRendererProps } from "./types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WidgetsRenderer: React.FC<WidgetsRendererProps> = ({
  dashboard,
  show,
  handleShow,
  setShow,
  isLoading,
}) => {
  const widgetTypes = [
    { type: "balance" as const, amount: dashboard?.totalBalance },
    { type: "spent" as const, amount: dashboard?.periodExpenses },
    { type: "earnings" as const, amount: dashboard?.periodEarnings },
  ];

  if (isLoading) {
    return (
      <>
        {[...Array(3)].map((_, i) => (
          <div style={{ marginBottom: 12 }} key={i}>
            <Skeleton height={100} borderRadius={20} />
          </div>
        ))}
        <div style={{ marginBottom: 12 }}>
          <Skeleton height={100} borderRadius={20} />
        </div>
      </>
    );
  }

  return (
    <>
      {widgetTypes.map((widget, index) => (
        <Widget
          key={index}
          type={widget.type}
          amount={widget.amount}
          className={undefined}
          className2={undefined}
        />
      ))}
      <button style={{ border: "none" }} onClick={handleShow}>
        <Widget
          type="add-transaction"
          className="add-transaction"
          className2={undefined}
          amount={undefined}
        />
      </button>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {show && (
          <AddExpense show={show} setShow={setShow} action={ACTIONS.CREATE} />
        )}
      </AnimatePresence>
    </>
  );
};

export default WidgetsRenderer;
