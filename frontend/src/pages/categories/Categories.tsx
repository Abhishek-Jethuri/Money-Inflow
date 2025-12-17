import React, { useEffect, useState } from "react";
import { MdAdd, MdOutlineGridView } from "react-icons/md";
import "./categories.scss";
import { BiCarousel } from "react-icons/bi";
import CarouselSlider from "../../components/common/carousel/slider/CarouselSlider";
import { AnimatePresence } from "framer-motion";
import {
  categoryReset,
  getCategories,
} from "../../features/category/categorySlice";
import { useErrorBoundary } from "react-error-boundary";
import CatagoriesModal from "../../components/catagories/CatagoriesModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface CategoryItem {
  name: string;
  icon: string;
  background: string;
  backgroundColor: string;
}

interface GroupedCategories {
  expense: Array<{
    icon: string;
    background: string;
    color: string;
    title: string;
    [key: string]: string;
  }>;
  income: Array<{
    icon: string;
    background: string;
    color: string;
    title: string;
    [key: string]: string;
  }>;
}

const incomeCategories: CategoryItem[] = [
  {
    name: "Running",
    icon: "WORK",
    background: "Saly-2",
    backgroundColor: "#FF5335",
  },
  {
    name: "Entertainment",
    icon: "ENTERTAINMENT",
    background: "Saly-14",
    backgroundColor: "#5432D380",
  },
  {
    name: "Clothing",
    icon: "CLOTHING",
    background: "Saly-9",
    backgroundColor: "var(--purple-100)",
  },
  {
    name: "Dining",
    icon: "DINING",
    background: "Saly-5",
    backgroundColor: "var(--purple-200)",
  },
  {
    name: "Education",
    icon: "EDUCATION",
    background: "Saly-12",
    backgroundColor: "#FF634880",
  },
  {
    name: "Groceries",
    icon: "GROCERY",
    background: "Saly-7",
    backgroundColor: "#F392F2",
  },
  {
    name: "Health & Medical",
    icon: "HEALTH",
    background: "Saly-8",
    backgroundColor: "#5352ED",
  },
  {
    name: "Transportation",
    icon: "TRANSPORTATION",
    background: "Saly-3",
    backgroundColor: "#FFA50280",
  },
  {
    name: "Travel",
    icon: "TRAVEL",
    background: "Saly-10",
    backgroundColor: "var(--purple-200)",
  },
];

const expenseCategories: CategoryItem[] = [
  {
    name: "Education",
    icon: "EDUCATION",
    background: "Saly-12",
    backgroundColor: "#FF634880",
  },
  {
    name: "Groceries",
    icon: "GROCERY",
    background: "Saly-7",
    backgroundColor: "#F392F2",
  },
  {
    name: "Health & Medical",
    icon: "HEALTH",
    background: "Saly-8",
    backgroundColor: "#5352ED",
  },
  {
    name: "Transportation",
    icon: "TRANSPORTATION",
    background: "Saly-3",
    backgroundColor: "#FFA50280",
  },
  {
    name: "Travel",
    icon: "TRAVEL",
    background: "Saly-10",
    backgroundColor: "var(--purple-200)",
  },
];

const Categories: React.FC = () => {
  const { category, isLoading, isError, message } = useAppSelector(
    (state) => state.category
  );

  const [gridToggle, setGridToggle] = useState<boolean>(false);
  const [isGridIcon, setIsGridIcon] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<GroupedCategories>({
    expense: [],
    income: [],
  });

  const toggleGrid = (): void => setGridToggle((prev) => !prev);
  const dispatch = useAppDispatch();

  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    setIsGridIcon(
      incomeCategories.length > 10 && expenseCategories.length > 10
    );
  }, [category.length]);

  useEffect(() => {
    if (category.length === 0) {
      dispatch(getCategories()).unwrap();
      return () => {
        dispatch(categoryReset());
      };
    }
  }, [dispatch, category.length]);

  if (isError) showBoundary(message);

  useEffect(() => {
    if (category.length !== 0) {
      const groupedCategory = category.reduce<GroupedCategories>(
        (acc, el) => {
          if (!acc["expense"]) acc["expense"] = [];
          if (!acc["income"]) acc["income"] = [];
          if (el.isIncome === false) {
            acc["expense"].push({
              icon: el.icon,
              background: el.color,
              color: el.color,
              title: el.title,
              _id: el._id,
            });
          } else {
            acc["income"].push({
              icon: el.icon,
              background: el.color,
              color: el.color,
              title: el.title,
              _id: el._id,
            });
          }
          return acc;
        },
        { expense: [], income: [] }
      );
      setCategoryData(groupedCategory);
    }
  }, [category]);

  const handleShow = (): void => {
    setShow(true);
  };

  if (isLoading) {
    return (
      <div className="catogories">
        <div style={{ marginBottom: 20 }}>
          <Skeleton width={40} height={40} borderRadius={8} />
        </div>
        <div style={{ marginBottom: 40 }}>
          <Skeleton width={200} height={24} style={{ marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 20, overflow: "hidden" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ flex: "0 0 75%" }}>
                <Skeleton height={120} borderRadius={20} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 40 }}>
          <Skeleton width={200} height={24} style={{ marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 20, overflow: "hidden" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ flex: "0 0 75%" }}>
                <Skeleton height={120} borderRadius={20} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "fixed", bottom: 20, right: 20 }}>
          <Skeleton width={60} height={60} borderRadius={30} />
        </div>
      </div>
    );
  }

  return (
    <div className="catogories">
      {!isGridIcon && (
        <button onClick={toggleGrid} className="category-grid-icon">
          {!gridToggle ? <MdOutlineGridView /> : <BiCarousel />}
        </button>
      )}
      <CarouselSlider
        title="Expense Catogories"
        catogoryitems={categoryData.expense}
        gridToggle={gridToggle}
        isLoading={isLoading}
      />
      <CarouselSlider
        title="Income Catogories"
        catogoryitems={categoryData.income}
        gridToggle={gridToggle}
        isLoading={isLoading}
      />
      <button className="category-add-icon" onClick={handleShow}>
        <MdAdd />
      </button>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {show && (
          <CatagoriesModal show={show} setShow={setShow} action="CREATE" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;
