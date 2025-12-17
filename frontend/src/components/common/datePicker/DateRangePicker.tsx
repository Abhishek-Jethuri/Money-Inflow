import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "./dateRangePicker.scss";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  onDateSubmit: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  onDateSubmit,
  ...props
}) => {
  const ranges = [
    {
      label: "Today",
      getRange: (): [Date, Date] => [
        moment().startOf("day").toDate(),
        moment().endOf("day").toDate(),
      ],
    },
    {
      label: "This Week",
      getRange: (): [Date, Date] => [
        moment().startOf("week").toDate(),
        moment().endOf("week").toDate(),
      ],
    },
    {
      label: "This Month",
      getRange: (): [Date, Date] => [
        moment().startOf("month").toDate(),
        moment().endOf("month").toDate(),
      ],
    },
    {
      label: "Last Month",
      getRange: (): [Date, Date] => [
        moment().subtract(1, "month").startOf("month").toDate(),
        moment().subtract(1, "month").endOf("month").toDate(),
      ],
    },
    {
      label: "This Year",
      getRange: (): [Date, Date] => [
        moment().startOf("year").toDate(),
        moment().endOf("year").toDate(),
      ],
    },
    {
      label: "Last Year",
      getRange: (): [Date, Date] => [
        moment().subtract(1, "year").startOf("year").toDate(),
        moment().subtract(1, "year").endOf("year").toDate(),
      ],
    },
    { label: "All History", getRange: (): [null, null] => [null, null] },
  ];

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onDateChange(start, end);
  };

  const handleRangeClick = (getRange: () => [Date | null, Date | null]) => {
    const [start, end] = getRange();
    onDateChange(start, end);
  };

  const handleClearClick = () => {
    onDateChange(null, null);
  };

  const handleSubmit = () => {
    onDateSubmit();
  };

  return (
    <div className="date-range-picker">
      <ReactDatePicker
        dateFormat="yyyy/MM/dd"
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        className="date-picker"
        selectsRange
        placeholderText="Select date range"
        openToDate={startDate || new Date()}
        disabledKeyboardNavigation
        {...props}
        popperProps={{
          strategy: "fixed", // Floating-UI option
        }}
        popperModifiers={[
          {
            name: "preventOverflow",
            options: { boundary: "viewport" },
            fn: ({ x, y }) => ({ x, y }), // REQUIRED BY POPPER V1 TYPES
          },
          {
            name: "flip",
            options: {},
            fn: ({ x, y }) => ({ x, y }), // ✔ required & valid
          },
        ]}
        popperPlacement="bottom-start"
        portalId="date-picker-portal" // Add a portal element
      >
        <div className="date-range-actions">
          {ranges.map((range, index) => (
            <button
              key={index}
              className="btn btn-primary"
              onClick={() => handleRangeClick(range.getRange)}
            >
              {range.label}
            </button>
          ))}
          <button className="btn btn-primary" onClick={handleClearClick}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Apply
          </button>
        </div>
      </ReactDatePicker>
    </div>
  );
};

export default DateRangePicker;
