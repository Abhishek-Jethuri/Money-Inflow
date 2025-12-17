import React from "react";
import type { Transaction } from "./types";
import { MdDelete, MdEdit } from "react-icons/md";
import moment from "moment";
import IndeterminateCheckbox from "../../components/common/indeterminateCheckBox/IndterminateCheckBox";
import { ICONS } from "../../constants/constants";
import Icon from "../../components/common/icon/Icon";
import TableFilters from "./TableFilters";
import withTableFilters from "./withTableFilters";
import { useMediaQuery } from "react-responsive";
import BasicTable from "../../components/common/table/BasicTable";

interface TransactionsTableProps {
  data: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
  setSelectedRows: (rows: string[]) => void;
}

const TransactionsTableWithFilters = withTableFilters(
  BasicTable as unknown as React.ComponentType<Record<string, unknown>>
);

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  data,
  onEdit,
  onDelete,
  setSelectedRows,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 576 });
  const isTablet = useMediaQuery({ maxWidth: 992, minWidth: 577 });

  const isWithinRange = (
    row: unknown,
    columnId: string,
    value: unknown[]
  ): boolean => {
    const tableDate = (
      row as Record<string, (columnId: string) => unknown>
    ).getValue(columnId);
    const [startDate, endDate] = value;
    const date = new Date(tableDate as string);
    const start = startDate === null ? null : new Date(startDate as string);
    const end = endDate === null ? null : new Date(endDate as string);
    if ((start || end) && !date) return false;
    if (start && end === null) {
      return date.getTime() > 0;
    } else if (start === null && end === null) {
      return date.getTime() > 0;
    } else if (!start && end) {
      return date.getTime() <= end.getTime();
    } else if (start && end) {
      return (
        date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
      );
    } else return true;
  };

  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: { table: unknown }) => (
          <IndeterminateCheckbox
            {...{
              checked: Boolean(
                (table as Record<string, () => unknown>).getIsAllRowsSelected()
              ),
              indeterminate: Boolean(
                (table as Record<string, () => unknown>).getIsSomeRowsSelected()
              ),
              onChange: (
                table as Record<string, () => unknown>
              ).getToggleAllRowsSelectedHandler() as unknown as () => void,
            }}
          />
        ),
        cell: ({ row }: { row: unknown }) => (
          <IndeterminateCheckbox
            {...{
              checked: Boolean(
                (row as Record<string, () => unknown>).getIsSelected()
              ),
              disabled: !(
                row as Record<string, () => unknown>
              ).getCanSelect() as unknown as boolean,
              indeterminate: Boolean(
                (row as Record<string, () => unknown>).getIsSomeSelected()
              ),
              onChange: (
                row as Record<string, () => unknown>
              ).getToggleSelectedHandler() as unknown as () => void,
            }}
          />
        ),
      },
      {
        header: "#",
        accessorFn: (_row: unknown, index: number) => index + 1,
        className: isTablet
          ? "hide-on-tablet"
          : isMobile
            ? "hide-on-mobile"
            : "",
      },
      {
        header: "Title",
        accessorKey: "title",
        accessorFn: (row: unknown) => {
          const rowData = row as Record<string, string>;
          return `${rowData.title.charAt(0).toUpperCase()}${rowData.title.slice(1)}`;
        },
        cell: (value: unknown) => {
          const cell = value as Record<string, () => unknown>;
          const rowOriginal = (
            (value as Record<string, unknown>).row as Record<
              string,
              Record<string, Record<string, string>>
            >
          ).original;
          return (
            <h4 className={isMobile ? "mobile-small-text" : ""}>
              <div className="cell-title">
                <span>
                  <Icon
                    icon={
                      ICONS[rowOriginal.category.icon as keyof typeof ICONS]
                    }
                    color={rowOriginal.category.color}
                    size={isMobile ? 16 : 24}
                  ></Icon>
                </span>
                {String(cell.getValue())}
              </div>
            </h4>
          );
        },
      },
      {
        header: "Notes",
        accessorKey: "description",
        accessorFn: (row: unknown) => {
          const rowData = row as Record<string, string>;
          return `${rowData.description.charAt(0).toUpperCase()}${rowData.description.slice(1)}`;
        },
        className: isMobile ? "hide-on-mobile" : "",
      },
      {
        header: "Category",
        accessorKey: "category.title",
        filterFn: "arrIncludesSome",
        className: isMobile ? "hide-on-mobile" : "",
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (d: unknown) => {
          const cell = d as Record<string, () => unknown>;
          const dateValue = String(cell.getValue());
          return (
            <span className={isMobile ? "mobile-small-text" : ""}>
              {moment(dateValue).format(isMobile ? "DD/MM/YY" : "DD MMM,YYYY")}
            </span>
          );
        },
        filterFn: isWithinRange,
      },
      {
        header: "Account",
        accessorKey: "account.title",
        className: isTablet || isMobile ? "hide-on-tablet" : "",
      },
      {
        header: "Amount",
        accessorKey: "amount",
        filterFn: "inNumberRange",
        cell: (props: unknown) => {
          const cellProps = props as Record<string, () => unknown>;
          const rowOriginal = (
            (props as Record<string, unknown>).row as Record<
              string,
              Record<string, unknown>
            >
          ).original;
          return (
            <h4
              className={`responsive-amount ${isMobile ? "mobile-small-text" : ""}`}
              style={{
                color: rowOriginal.isIncome === true ? "green" : "red",
              }}
            >
              {String(cellProps.getValue())}
            </h4>
          );
        },
      },
      {
        header: "Actions",
        id: "delete",
        cell: (props: unknown) => {
          const rowOriginal = (
            (props as Record<string, unknown>).row as Record<
              string,
              Record<string, unknown>
            >
          ).original;
          return (
            <div
              className={isMobile ? "mobile-actions" : ""}
              style={{
                display: "flex",
                gap: isMobile ? "5px" : "10px",
                fontSize: isMobile ? "16px" : "20px",
                color: "var(--purple-100)",
              }}
            >
              <span
                style={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  onDelete(
                    (rowOriginal as unknown as Record<string, string>)._id
                  )
                }
              >
                <MdDelete />
              </span>
              <span
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  onEdit(rowOriginal as unknown as Transaction);
                }}
              >
                <MdEdit />
              </span>
            </div>
          );
        },
      },
    ],
    [isMobile, isTablet, onDelete, onEdit]
  );

  const filterConfig = {
    search: { key: "title" },
    category: { key: "category.title" },
    date: { key: "date" },
    amount: { key: "amount" },
    FilterComponent: TableFilters,
  };

  return (
    <div className="responsive-table-container">
      <TransactionsTableWithFilters
        data={data as unknown as Record<string, unknown>[]}
        columns={columns}
        filterConfig={filterConfig as unknown as Record<string, unknown>}
        onRowSelect={setSelectedRows}
      />
    </div>
  );
};

export default TransactionsTable;
