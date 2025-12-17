import React, { useState, useEffect, useMemo, useCallback } from "react";
import DateRangePicker from "../../components/common/datePicker/DateRangePicker";
import MultiRangeSlider from "../../components/common/multiRangeSlider/MultiRangeSlider";
import { useMediaQuery } from "react-responsive";
import MultiSelectDropdown from "../../components/common/MultiSelectDropdown/MultiSelectDropdown";
import { useAppSelector } from "../../app/hooks";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectValue {
  [key: string]: boolean;
}

interface TableFiltersProps {
  updateFilter: (filterType: string, value: unknown) => void;
  data: unknown[];
}

const TableFilters: React.FC<TableFiltersProps> = ({ updateFilter, data }) => {
  const globalStartDate = useAppSelector((state) => state.dashboard.startDate);
  const globalEndDate = useAppSelector((state) => state.dashboard.endDate);

  const isMobile = useMediaQuery({ maxWidth: 576 });

  const [searchValue, setSearchValue] = useState<string>("");
  const [category, setCategory] = useState<MultiSelectValue | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: globalStartDate,
    endDate: globalEndDate,
  });
  const [minAmount, setMinVal] = useState<number>(0);
  const [maxAmount, setMaxVal] = useState<number>(1000);

  const options = useMemo((): Option[] => {
    const uniqueCategories = new Set<string>();
    data.forEach((item) => {
      const dataItem = item as Record<string, unknown>;
      if ((dataItem.category as Record<string, string>)?.title) {
        uniqueCategories.add(
          (dataItem.category as Record<string, string>).title
        );
      }
    });
    return Array.from(uniqueCategories).map((cat) => ({
      value: cat,
      label: cat,
    }));
  }, [data]);

  const amountBounds = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    data.forEach((item) => {
      const dataItem = item as Record<string, unknown>;
      if (dataItem.amount) {
        min = Math.min(min, dataItem.amount as number);
        max = Math.max(max, dataItem.amount as number);
      }
    });
    return { min: Math.floor(min), max: Math.ceil(max) };
  }, [data]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilter("search", searchValue || undefined);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchValue, updateFilter]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  const handleMultiSelectChange = useCallback(
    (selectedOptions: MultiSelectValue) => {
      if (!selectedOptions) {
        setCategory(null);
        updateFilter("category", undefined);
        return;
      }

      setCategory(selectedOptions);

      const hasSelectedCategories = Object.values(selectedOptions).some(
        (value) => value === true
      );
      if (hasSelectedCategories) {
        updateFilter("category", selectedOptions);
      } else {
        updateFilter("category", undefined);
      }
    },
    [updateFilter]
  );

  const handleDateChange = useCallback(
    (start: Date | null, end: Date | null) => {
      if (start && end) {
        setDateRange({ startDate: start, endDate: end });
      }
    },
    []
  );

  const handleDateSubmit = useCallback(() => {
    updateFilter("date", dateRange);
  }, [dateRange, updateFilter]);

  const handleAmountChange = useCallback(
    ({ min, max }: { min: number; max: number }) => {
      setMinVal(min);
      setMaxVal(max);
    },
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (minAmount !== amountBounds.min || maxAmount !== amountBounds.max) {
        updateFilter("range", { min: minAmount, max: maxAmount });
      } else {
        updateFilter("range", undefined);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [minAmount, maxAmount, amountBounds.min, amountBounds.max, updateFilter]);

  useEffect(() => {
    if (amountBounds.min !== Infinity && amountBounds.max !== -Infinity) {
      setMinVal(amountBounds.min);
      setMaxVal(amountBounds.max);
    }
  }, [amountBounds.min, amountBounds.max]);

  return (
    <div className="table-filters">
      <div className="table-select-container">
        <MultiSelectDropdown
          value={category}
          onChange={handleMultiSelectChange}
          placeholder="Select Item"
          options={options}
          label="Category"
          size="fw"
        />
      </div>

      <div className="table-input-container">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className="input-primary"
          name="title"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={isMobile ? "Search" : "Search title"}
        />
      </div>

      <div className="table-date-container">
        <label htmlFor="date">Date</label>
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onDateChange={handleDateChange}
          onDateSubmit={handleDateSubmit}
        />
      </div>

      <div className="amount-range-container">
        <MultiRangeSlider
          min={amountBounds.min}
          max={amountBounds.max}
          onChange={handleAmountChange}
          label="Amount"
        />
      </div>
    </div>
  );
};

export default TableFilters;
