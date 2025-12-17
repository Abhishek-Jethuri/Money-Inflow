import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./accountModal.scss";
import Icon from "../../common/icon/Icon";
import {
  ACTIONS,
  CATEGORY_BACKGROUND_OPTIONS,
  CATEGORY_COLOR_OPTIONS,
  CATEGORY_ICON_OPTIONS,
  ICONS,
} from "../../../constants/constants";
import Modal from "../../common/modal/Modal";
import SelectDropdown from "../../common/selectDropdown/SelectDropdown";
import {
  createAccount,
  updateAccount,
} from "../../../features/account/accountSlice";
import type { AccountData } from "../../../features/account/types";
import { useMediaQuery } from "react-responsive";
import { useCurrency } from "../../../utils/currency";
import { useAppDispatch } from "../../../app/hooks";

interface AccountModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  type?: string;
  action: string;
  updateData?: {
    _id: string;
    title: string;
    initialAmount: number;
    amount: number;
    icon: string;
    isIncome?: boolean;
    numberOfTransactions?: number;
    [key: string]: string | number | boolean | undefined;
  };
}

interface IconOption {
  value: React.ReactNode;
  label: React.ReactNode;
  key?: string;
}

interface ColorOption {
  value: React.ReactNode;
  label: React.ReactNode;
  key?: string;
}

const AccountModal: React.FC<AccountModalProps> = ({
  show,
  setShow,
  action,
  updateData,
}) => {
  const { currency, symbol } = useCurrency();

  const backgroundArray = [
    "Saly-2",
    "Saly-3",
    "Saly-4",
    "Saly-5",
    "Saly-6",
    "Saly-7",
    "Saly-8",
    "Saly-9",
    "Saly-10",
    "Saly-12",
    "Saly-13",
    "Saly-14",
    "Saly-15",
    "Saly-16",
    "Saly-17",
    "Saly-18",
    "Saly-19",
  ];

  const colorWheel = (value: string): React.ReactNode => {
    return (
      <div
        className="accountCircle"
        style={{ background: `${value}` }}
        key={value}
      ></div>
    );
  };

  const isUpdate = action === ACTIONS.UPDATE;

  const [title, setTitle] = useState(isUpdate ? updateData?.title || "" : "");
  const [initialAmount, setInitialAmount] = useState<string>(
    isUpdate ? updateData?.initialAmount?.toString() || "" : ""
  );
  const [amount, setAmount] = useState<string>(
    isUpdate ? updateData?.amount?.toString() || "" : ""
  );

  const [icon, setIcon] = useState<IconOption | string>(
    isUpdate && updateData?.icon
      ? {
          value: (
            <Icon
              icon={ICONS[updateData.icon as keyof typeof ICONS]}
              label={updateData.icon}
              key={updateData.icon}
            />
          ),
          label: (
            <Icon
              icon={ICONS[updateData.icon as keyof typeof ICONS]}
              label={updateData.icon}
              key={updateData.icon}
            />
          ),
        }
      : ""
  );
  const [background, setBackground] = useState("");
  const [iconOptions, setIconOptions] = useState<IconOption[]>();
  const [_colorOptions, setColorOptions] = useState<ColorOption[]>();
  const [color, setColor] = useState<ColorOption | string>("");
  const dispatch = useAppDispatch();

  const isMobile = useMediaQuery({ maxWidth: 576 });

  useEffect(() => {
    setIconOptions([
      ...CATEGORY_ICON_OPTIONS.map((value) => ({
        value: (
          <Icon
            icon={ICONS[value as keyof typeof ICONS]}
            label={value}
            key={value}
          />
        ),
        label: (
          <Icon
            icon={ICONS[value as keyof typeof ICONS]}
            label={value}
            key={value}
          />
        ),
      })),
    ]);

    setColorOptions([
      ...CATEGORY_COLOR_OPTIONS.map((value) => {
        return { value: colorWheel(value), label: colorWheel(value) };
      }),
    ]);
    setBackground(
      CATEGORY_BACKGROUND_OPTIONS[
        Math.floor(Math.random() * backgroundArray.length)
      ]
    );
  }, [backgroundArray.length]);

  const resetForm = () => {
    setTitle("");
    setInitialAmount("");
    setAmount("");
    setIcon("");
    setColor("");
    setBackground("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = isUpdate
      ? parseFloat(initialAmount || "0")
      : parseFloat(amount || "0");

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (isNaN(amountValue) || amountValue < 0) {
      alert("Please enter a valid amount");
      return;
    }

    const accountData = {
      title: title.trim(),
      amount: amountValue,
      initialAmount: amountValue,
      currency,
      icon:
        typeof icon === "object" && icon !== null && "key" in icon
          ? ((icon as unknown as { key?: string }).key ?? String(icon))
          : String(icon),
      color:
        typeof color === "object" && color !== null && "key" in color
          ? ((color as unknown as { key?: string }).key ?? String(color))
          : String(color),
    } as AccountData;

    try {
      if (isUpdate && updateData) {
        await dispatch(
          updateAccount({
            id: updateData._id,
            accountUpdateData: accountData,
          })
        ).unwrap();
      } else {
        await dispatch(createAccount(accountData)).unwrap();
      }
      setShow(false);
      resetForm();
    } catch (error) {
      console.error("Error creating/updating account:", error);
      // keep modal open so user can retry
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal
      isOpen={show}
      onClose={handleClose}
      isRight={isMobile ? false : true}
      animate="rightToLeft"
    >
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="catagories-modal-left"
        style={{
          backgroundImage: `url("src/assets/backdrops/${background}.png")`,
          backgroundColor: "var(--purple-100)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "bottom",
        }}
      >
        <Modal.Header>
          {isUpdate ? "Update Account" : "Create Account"}
        </Modal.Header>
      </motion.div>

      <form onSubmit={onSubmit} className="catagories-modal-form">
        <div className="catagories-modal-right">
          <Modal.Body isRight={true}>
            <div className="input-container">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="input-primary"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
            </div>
            <div className="input-container">
              <label htmlFor="amount">Initial Balance ({symbol})</label>
              <input
                type="number"
                className="input-primary"
                name="amount"
                value={isUpdate ? initialAmount : amount}
                onChange={(e) => {
                  if (isUpdate) setInitialAmount(e.target.value);
                  else setAmount(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-container">
              <SelectDropdown
                value={icon as unknown as { label: string; value: string }}
                onChange={(newValue) =>
                  setIcon(newValue as IconOption | string)
                }
                placeholder="Select Item"
                options={
                  iconOptions as unknown as { label: string; value: string }[]
                }
                label="Icon"
                isGrid
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="form-group">
              <Modal.DismissButton className="btn btn-secondary">
                Close
              </Modal.DismissButton>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </Modal.Footer>
        </div>
      </form>
    </Modal>
  );
};

export default AccountModal;
