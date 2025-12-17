import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../common/modal/Modal";
import "./addExpense.scss";
import SelectDropdown from "../../common/selectDropdown/SelectDropdown";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BackdropExpense from "../../../assets/backdrops/Saly-3.png";
import BackdropIncome from "../../../assets/backdrops/Saly-2.png";
import ToggleButton from "../../common/toggleButton/ToggleButton";
import { getCategories } from "../../../features/category/categorySlice";
import { getAccounts } from "../../../features/account/accountSlice";
import {
  createTransaction,
  updateTransaction,
} from "../../../features/transaction/transactionSlice";
import { ACTIONS, TOGGLEITEMS, TYPES } from "../../../constants/constants";
import useDebounce from "../../../hooks/useDebounce";
import type {
  AddExpenseProps,
  CategoryValue,
  AccountValue,
  GroupedCategoryOptions,
  AccountOption,
} from "./types";
import type { Category } from "../../../features/category/types";
import type { Account } from "../../../features/account/types";
import CardFlip from "../../common/cardFlip/CardFlip";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

function AddExpense({ show, setShow, action, updateData }: AddExpenseProps) {
  const isUpdate = action === ACTIONS.UPDATE ? true : false;

  const { category } = useAppSelector((state) => state.category);
  const { account } = useAppSelector((state) => state.account);

  const [title, setTitle] = useState<string>(
    isUpdate ? updateData?.title || "" : ""
  );
  const [amount, setAmount] = useState<string | number>(
    isUpdate ? Math.abs(updateData?.amount || 0) : ""
  );
  const [categoryValue, setCategoryValue] = useState<CategoryValue>(
    isUpdate
      ? {
          label: updateData?.category?.title || "",
          value: updateData?.category?._id || "",
        }
      : { label: "", value: "" }
  );
  const [accountValue, setAccountValue] = useState<AccountValue>(
    isUpdate
      ? {
          label: updateData?.account?.title || "",
          value: updateData?.account?._id || "",
        }
      : { label: "", value: "" }
  );
  const [date, setDate] = useState<Date>(
    isUpdate && updateData?.date ? new Date(updateData.date) : new Date()
  );
  const [notes, setNotes] = useState<string>(
    isUpdate ? updateData?.description || "" : ""
  );
  const [value, setValue] = useState<string>(
    isUpdate
      ? updateData?.isIncome
        ? TOGGLEITEMS[1].id
        : TOGGLEITEMS[0].id
      : TOGGLEITEMS[0].id
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [categoryOptions, setCategoryOptions] =
    useState<GroupedCategoryOptions>({
      expense: [],
      income: [],
    });
  const [accountOptions, setAccountOptions] = useState<AccountOption[]>([]);

  const debouncedTitle = useDebounce(title, 300);
  const debouncedAmount = useDebounce(amount, 300);
  const debouncedNotes = useDebounce(notes, 300);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (category.length === 0) {
      dispatch(getCategories());
    }
    if (account.length === 0) {
      dispatch(getAccounts());
    }
  }, [dispatch, category.length, account.length]);

  useEffect(() => {
    if (category.length !== 0) {
      const groupedCategory = category.reduce(
        (acc: GroupedCategoryOptions, el: Category) => {
          if (!acc.expense) acc.expense = [];
          if (!acc.income) acc.income = [];
          if (el.isIncome === false) {
            acc.expense.push({ value: el._id, label: el.title });
          } else {
            acc.income.push({ value: el._id, label: el.title });
          }
          return acc;
        },
        { expense: [], income: [] }
      );
      setCategoryOptions(groupedCategory);
    }
    if (account.length !== 0) {
      const groupedAccount = account.map((el: Account): AccountOption => {
        return { value: el._id, label: el.title };
      });
      setAccountOptions(groupedAccount);
    }
  }, [category, account]);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategoryValue({ label: "", value: "" });
    setAccountValue({ label: "", value: "" });
    setDate(new Date());
    setNotes("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: debouncedTitle,
      amount:
        value === TYPES.INCOME
          ? Math.abs(Number(debouncedAmount)).toFixed(2)
          : parseFloat("-" + debouncedAmount).toFixed(2),
      account: accountValue.value,
      date: date.toISOString(),
      category: categoryValue.value,
      description: debouncedNotes,
      isIncome: value === TYPES.INCOME ? true : false,
      type: TYPES[value.toUpperCase() as keyof typeof TYPES],
    };
    try {
      if (isUpdate) {
        await dispatch(
          updateTransaction({
            id: updateData?._id || "",
            transactionUpdateData: data,
          })
        );
      } else {
        await dispatch(createTransaction(data));
      }
      setShow(false);
      resetForm();
    } catch (_error) {
      setShow(true);
    }
  };
  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setCategoryValue({ label: "", value: "" });
  }, []);

  useEffect(() => {
    setIsFlipped(value === TYPES.INCOME);
  }, [value]);

  return (
    <>
      <Modal isOpen={show} onClose={handleClose} animate="diffuse">
        <div className="addExpense-modal-left">
          <Modal.Header>
            {isUpdate ? "Update Tranasaction" : "Add Tranasaction"}
          </Modal.Header>
          <div className="toggle-left">
            <ToggleButton
              items={TOGGLEITEMS}
              value={value}
              onChange={onChange}
            />
          </div>
          <CardFlip
            isFlipped={isFlipped}
            front={
              <div className="backdrop">
                <img
                  className="backdrop-expense"
                  // style={{ borderBottom: "1px solid black" }}
                  src={BackdropExpense}
                  alt=""
                />
              </div>
            }
            back={
              <div className="backdrop">
                <img className="backdrop-income" src={BackdropIncome} alt="" />
              </div>
            }
          ></CardFlip>
        </div>
        <form onSubmit={onSubmit} className="addExpense-modal-form">
          <div className="addExpense-modal-right">
            <Modal.Body>
              <div className="toggle-right">
                <ToggleButton
                  items={TOGGLEITEMS}
                  value={value}
                  onChange={onChange}
                />
              </div>
              <div className="input-container">
                <label htmlFor="amount">Title</label>
                <input
                  type="text"
                  className="input-primary"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></input>
              </div>
              <div className="input-container">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="input-primary"
                  name="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "+") {
                      e.preventDefault();
                    }
                  }}
                ></input>
              </div>
              <div className="input-container">
                <SelectDropdown
                  value={categoryValue}
                  onChange={(newValue) =>
                    setCategoryValue(newValue as CategoryValue)
                  }
                  placeholder="Select Category"
                  options={
                    value === TYPES.INCOME
                      ? categoryOptions.income
                      : categoryOptions.expense
                  }
                  label="Category"
                ></SelectDropdown>
              </div>
              <div className="input-container">
                <SelectDropdown
                  value={accountValue}
                  onChange={(newValue) =>
                    setAccountValue(newValue as AccountValue)
                  }
                  placeholder="Select Account"
                  options={accountOptions}
                  label="Account"
                ></SelectDropdown>
              </div>
              <div className="input-container">
                <label htmlFor="amount">Date</label>
                <ReactDatePicker
                  dateFormat="yyyy/MM/dd"
                  selected={date}
                  onChange={(date: Date | null) => {
                    if (date) setDate(date);
                  }}
                  className="date-picker"
                />
              </div>
              <div className="input-container">
                <label htmlFor="notes">Notes</label>
                <textarea
                  className="input-primary"
                  name="notes"
                  rows={1}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="form-group">
                <Modal.DismissButton className="btn btn-secondary">
                  Close
                </Modal.DismissButton>
                <button type="submit" className="btn btn-primary">
                  {isUpdate ? "Update Changes" : "Save Changes"}
                </button>
              </div>
            </Modal.Footer>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default AddExpense;
