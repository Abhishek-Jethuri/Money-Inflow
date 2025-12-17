import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./catagoriesModal.scss";
import Modal from "../common/modal/Modal";
import ToggleButton from "../common/toggleButton/ToggleButton";
import SelectDropdown from "../common/selectDropdown/SelectDropdown";
import {
  ACTIONS,
  CATEGORY_BACKGROUND_OPTIONS,
  CATEGORY_COLOR_OPTIONS,
  CATEGORY_ICON_OPTIONS,
  ICONS,
  TOGGLEITEMS,
  TYPES,
} from "../../constants/constants";
import Icon from "../common/icon/Icon";
import {
  createCategory,
  updateCategory,
} from "../../features/category/categorySlice";
import { useMediaQuery } from "react-responsive";
import { useAppDispatch } from "../../app/hooks";

interface CategoryUpdateData {
  _id?: string;
  title: string;
  icon: string;
  color: string;
  background: string;
  isIncome?: boolean;
}

interface CatagoriesModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  type?: string;
  action: string;
  updateData?: CategoryUpdateData;
}

interface IconOption {
  value: React.ReactNode;
  label: React.ReactNode;
}

interface ColorOption {
  value: React.ReactNode;
  label: React.ReactNode;
}

const CatagoriesModal: React.FC<CatagoriesModalProps> = ({
  show,
  setShow,
  action,
  updateData,
}) => {
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

  const isMobile = useMediaQuery({ maxWidth: 576 });

  const [value, setValue] = useState<string>(
    isUpdate
      ? updateData?.isIncome
        ? TOGGLEITEMS[1].id
        : TOGGLEITEMS[0].id
      : TOGGLEITEMS[0].id
  );
  const [title, setTitle] = useState(isUpdate ? updateData?.title || "" : "");
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
  const [color, setColor] = useState<ColorOption>(
    isUpdate && updateData?.color
      ? {
          value: colorWheel(updateData.color),
          label: colorWheel(updateData.color),
        }
      : {
          value: <></>,
          label: <></>,
        }
  );
  const [background, setBackground] = useState(
    isUpdate ? updateData?.background || "" : ""
  );
  const [iconOptions, setIconOptions] = useState<IconOption[]>();
  const [colorOptions, setColorOptions] = useState<ColorOption[]>();
  const dispatch = useAppDispatch();

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

    if (!isUpdate) {
      setBackground(
        CATEGORY_BACKGROUND_OPTIONS[
          Math.floor(Math.random() * backgroundArray.length)
        ]
      );
    }
  }, [backgroundArray.length, isUpdate]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const resetForm = () => {
    setTitle("");
    setIcon("");
    setColor({ value: <></>, label: <></> });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: title,
      icon:
        typeof icon === "object" && icon !== null && "key" in icon
          ? ((icon as unknown as { key?: string }).key ?? String(icon))
          : String(icon),
      color:
        typeof color === "object" && color !== null && "key" in color
          ? ((color as unknown as { key?: string }).key ?? String(color))
          : String(color),
      background: background,
      isIncome: value === TYPES.INCOME,
    };

    try {
      if (isUpdate && updateData && updateData._id) {
        await dispatch(
          updateCategory({
            id: updateData._id,
            categoryUpdateData: data,
          })
        ).unwrap();
      } else {
        await dispatch(createCategory(data)).unwrap();
      }
      setShow(false);
      resetForm();
    } catch (_error) {
      setShow(true);
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
          backgroundImage: `url("src/assets/backdrops/${
            isUpdate ? updateData?.background : background
          }.png")`,
          backgroundColor: isUpdate ? updateData?.color : "var(--purple-100)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "bottom",
        }}
      >
        <Modal.Header>
          {isUpdate ? "Update Category" : "Create Category"}
        </Modal.Header>
        <div>
          <ToggleButton items={TOGGLEITEMS} value={value} onChange={onChange} />
        </div>
      </motion.div>

      <form onSubmit={onSubmit} className="catagories-modal-form">
        <div className="catagories-modal-right">
          <Modal.Body isRight={true}>
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
              <SelectDropdown
                value={
                  icon as unknown as { label: string; value: string } | null
                }
                onChange={(newValue) =>
                  setIcon(newValue as ColorOption | string)
                }
                placeholder="Select Item"
                options={
                  iconOptions as unknown as { label: string; value: string }[]
                }
                label="Icon"
                isGrid
              ></SelectDropdown>
            </div>
            <div className="input-container">
              <SelectDropdown
                value={
                  color as unknown as { label: string; value: string } | null
                }
                onChange={(newValue) => setColor(newValue as ColorOption)}
                placeholder="Select Item"
                options={
                  colorOptions as unknown as { label: string; value: string }[]
                }
                label="Color"
                isGrid
              ></SelectDropdown>
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

export default CatagoriesModal;
