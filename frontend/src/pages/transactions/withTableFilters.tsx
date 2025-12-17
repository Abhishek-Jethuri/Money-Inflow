import React, { useState, useCallback, useMemo } from "react";
import { setDateRange } from "../../features/dashboard/dashboardSlice";
import { getTransactions } from "../../features/transaction/transactionSlice";
import { useAppDispatch } from "../../app/hooks";

interface FilterConfig {
  customHandlers?: Record<string, unknown>;
  FilterComponent?: React.ComponentType<Record<string, unknown>>;
  filterComponentProps?: Record<string, unknown>;
  search?: { key: string };
  category?: { key: string };
  date?: { key: string };
  range?: { key: string };
}

interface WithTableFiltersProps {
  data: Record<string, unknown>[];
  columns: Record<string, unknown>[];
  filterConfig?: FilterConfig;
  onRowSelect?: (ids: string[]) => void;
  [key: string]: unknown;
}

const withTableFilters = (
  WrappedComponent: React.ComponentType<Record<string, unknown>>
) => {
  return function WithTableFiltersComponent({
    data,
    columns,
    filterConfig = {},
    onRowSelect,
    ...props
  }: WithTableFiltersProps) {
    const [filteredData, setFilteredData] = useState(data);
    const [_selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
    const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>(
      {}
    );

    const dispatch = useAppDispatch();

    const defaultFilterHandlers = useMemo(
      () => ({
        searchFilter: (
          data: Record<string, unknown>[],
          searchValue: string,
          searchKey = "title"
        ) => {
          if (!searchValue) return data;
          return data.filter((item) =>
            String(item[searchKey])
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        },
        categoryFilter: (
          data: Record<string, unknown>[],
          selectedCategories: Record<string, boolean>,
          categoryKey = "category"
        ) => {
          if (
            !selectedCategories ||
            Object.keys(selectedCategories).length === 0
          ) {
            return data;
          }

          const activeCategories = Object.entries(selectedCategories)
            .filter(([_, isSelected]) => isSelected)
            .map(([category]) => category);

          if (activeCategories.length === 0) {
            return data;
          }

          return data.filter((item) => {
            const categoryValue = categoryKey
              .split(".")
              .reduce(
                (obj: Record<string, unknown> | null, key: string) =>
                  obj && (obj[key] as Record<string, unknown> | null),
                item
              );
            return activeCategories.includes(String(categoryValue));
          });
        },

        dateFilter: (
          data: Record<string, unknown>[],
          { startDate, endDate }: { startDate: Date; endDate: Date },
          dateKey = "date"
        ) => {
          dispatch(setDateRange({ startDate, endDate }));
          dispatch(
            getTransactions({
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            })
          );

          return data.filter((item) => {
            const itemDate = new Date(String(item[dateKey]));
            return itemDate >= startDate && itemDate <= endDate;
          });
        },

        rangeFilter: (
          data: Record<string, unknown>[],
          { min, max }: { min: number; max: number },
          key = "amount"
        ) => {
          if (min === undefined || max === undefined) return data;

          return data.filter(
            (item) =>
              (item[key] as number) >= min && (item[key] as number) <= max
          );
        },
      }),
      [dispatch]
    );

    const filterHandlers = useMemo(
      () => ({
        ...defaultFilterHandlers,
        ...filterConfig.customHandlers,
      }),
      [defaultFilterHandlers, filterConfig.customHandlers]
    );

    const applyFilters = useMemo(
      () => (originalData: unknown[], filters: Record<string, unknown>) => {
        let result = originalData;

        Object.entries(filters).forEach(([filterType, filterValue]) => {
          const filterKey =
            `${filterType}Filter` as keyof typeof filterHandlers;
          const filterHandler = filterHandlers[filterKey];
          if (filterHandler && filterValue !== undefined) {
            const configKey = filterConfig[filterType as keyof FilterConfig] as
              | { key: string }
              | undefined;
            result = (
              filterHandler as (
                data: unknown[],
                value: unknown,
                key?: string
              ) => unknown[]
            )(result, filterValue, configKey?.key);
          }
        });

        return result;
      },
      [filterHandlers, filterConfig]
    );

    const updateFilter = useCallback(
      (filterType: string, value: unknown) => {
        setActiveFilters((prevFilters) => {
          const newFilters =
            value === undefined
              ? { ...prevFilters, [filterType]: undefined }
              : { ...prevFilters, [filterType]: value };

          const cleanedFilters = Object.fromEntries(
            Object.entries(newFilters).filter(([, v]) => v !== undefined)
          );

          const filtered = applyFilters(data, cleanedFilters);
          setFilteredData(filtered as Record<string, unknown>[]);

          return cleanedFilters;
        });
      },
      [data, applyFilters]
    );

    const handleRowSelect = useCallback(
      (ids: string[]) => {
        setSelectedRowIds(ids);
        onRowSelect?.(ids);
      },
      [onRowSelect]
    );

    React.useEffect(() => {
      const filtered = applyFilters(data, activeFilters);
      setFilteredData(filtered as Record<string, unknown>[]);
    }, [data, applyFilters, activeFilters]);

    const filterProps = {
      updateFilter,
      activeFilters,
      data,
    };

    return (
      <div className="filtered-table-container">
        {filterConfig.FilterComponent && (
          <filterConfig.FilterComponent
            {...filterProps}
            {...(filterConfig.filterComponentProps || {})}
          />
        )}

        <WrappedComponent
          data={filteredData}
          columns={columns}
          onRowSelect={handleRowSelect}
          {...props}
        />
      </div>
    );
  };
};

export default withTableFilters;
