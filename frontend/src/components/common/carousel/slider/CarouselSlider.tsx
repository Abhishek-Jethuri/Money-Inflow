import React, { useEffect, useRef, useState } from "react";
import "./carouselSlider.scss";
import { BiChevronLeftCircle, BiChevronRightCircle } from "react-icons/bi";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import CarouselItem from "../carouselItem/CarouselItem";
import CircleProgressBar from "../../circleProgressBar/CircleProgressBar";
import { ACTIONS } from "../../../../constants/constants";
import CatagoriesModal from "../../../catagories/CatagoriesModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeleteCategoryModal from "../../modal/DeleteCategoryModal/DeleteCategoryModal";

const START_INDEX = 1;
const DRAG_THRESHOLD = 150;
const FALLBACK_WIDTH = 509;

interface CarouselSliderProps {
  title: string;
  catogoryitems: Array<{
    icon: string;
    background: string;
    color: string;
    title: string;
    _id?: string;
    [key: string]: string | undefined;
  }>;
  gridToggle: boolean;
  isLoading: boolean;
}

interface CategoryUpdateData {
  _id?: string;
  title: string;
  icon: string;
  color: string;
  background: string;
  isIncome?: boolean;
}

const CarouselSlider: React.FC<CarouselSliderProps> = ({
  title,
  catogoryitems,
  gridToggle,
  isLoading,
}) => {
  const [activeSlide, setActiveSlide] = useState(START_INDEX);
  const [_isDragging, setIsDragging] = useState(false);
  const [catGridToggle, setCatGridToggle] = useState(false);
  const [show, setShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editData, setEditData] = useState<CategoryUpdateData | false>(false);
  const [deleteData, setDeleteData] = useState<CategoryUpdateData | false>(
    false
  );

  const canScrollPrev = activeSlide > 1;
  const canScrollNext = activeSlide < (catogoryitems?.length || 0) - 1;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const offsetX = useMotionValue(0);
  const animatedX = useSpring(offsetX, {
    damping: 40,
    stiffness: 400,
  });

  const carousal = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const CURSOR_SIZE = 80;

  useEffect(() => {
    if (catogoryitems?.length > 10) {
      setCatGridToggle(true);
    }
  }, [catogoryitems]);

  useEffect(() => {
    if (catGridToggle || gridToggle) {
      offsetX.set(0);
      setActiveSlide(1);
    }
  }, [catGridToggle, gridToggle, offsetX]);

  function handleDragSnap({
    offset: { x: dragOffset },
  }: {
    offset: { x: number };
  }) {
    //reset drag state
    setIsDragging(false);
    carousal.current?.removeAttribute("data-dragging");

    //stop drag animation (rest velocity)
    animatedX.stop();

    const currentOffset = offsetX.get();

    //snap back if not dragged far enough or if at the start/end of the list
    if (
      Math.abs(dragOffset) < DRAG_THRESHOLD ||
      (!canScrollPrev && dragOffset > 0) ||
      (!canScrollNext && dragOffset < 0)
    ) {
      animatedX.set(currentOffset);
      return;
    }

    let offsetWidth = 0;
    /*
      - start searching from currently active slide in the direction of the drag
      - check if the drag offset is greater than the width of the current item
      - if it is, add/subtract the width of the next/prev item to the offsetWidth
      - if it isn't, snap to the next/prev item
    */
    for (
      let i = activeSlide;
      dragOffset > 0 ? i >= 0 : i < itemsRef.current.length;
      dragOffset > 0 ? i-- : i++
    ) {
      const item = itemsRef.current[i];
      if (item === null) continue;
      const itemOffset = item.offsetWidth;

      const prevItemWidth =
        itemsRef.current[i - 1]?.offsetWidth ?? FALLBACK_WIDTH;
      const nextItemWidth =
        itemsRef.current[i + 1]?.offsetWidth ?? FALLBACK_WIDTH;

      if (
        (dragOffset > 0 && //dragging left
          dragOffset > offsetWidth + itemOffset && //dragged past item
          i > 2) || //not the first/second item
        (dragOffset < 0 && //dragging right
          dragOffset < offsetWidth + -itemOffset && //dragged past item
          i < itemsRef.current.length - 2) //not the last/second to last item
      ) {
        if (dragOffset > 0) offsetWidth += prevItemWidth;
        else offsetWidth -= nextItemWidth;
        continue;
      }

      if (dragOffset > 0) {
        //prev
        offsetX.set(currentOffset + offsetWidth + prevItemWidth);
        setActiveSlide(i - 1);
      } else {
        //next
        offsetX.set(currentOffset + offsetWidth - nextItemWidth);
        setActiveSlide(i + 1);
      }
      break;
    }
  }

  function scrollPrev() {
    //prevent scrolling past first item
    if (!canScrollPrev) return;

    const nextWidth = itemsRef.current
      .at(activeSlide - 1)
      ?.getBoundingClientRect().width;
    if (nextWidth === undefined) return;
    offsetX.set(offsetX.get() + nextWidth);

    setActiveSlide((prev) => prev - 1);
  }

  function scrollNext() {
    // prevent scrolling past last item
    if (!canScrollNext) return;

    const nextWidth = itemsRef.current
      .at(activeSlide + 1)
      ?.getBoundingClientRect().width;
    if (nextWidth === undefined) return;
    offsetX.set(offsetX.get() - nextWidth);

    setActiveSlide((prev) => prev + 1);
  }

  const handleShow = (item: CategoryUpdateData) => {
    setEditData(item);
    setShow(true);
  };

  const handleDelete = (item: CategoryUpdateData) => {
    setDeleteData(item);
    setShowDeleteAlert(true);
  };

  if (isLoading) {
    return (
      <div className="catogories-container">
        <div className="catagories-header">
          <Skeleton width={200} height={24} />
          <Skeleton width={30} height={30} circle />
        </div>
        <div className="categories-income">
          <div className="card-container">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ flex: "0 0 75%" }}>
                <Skeleton height={120} borderRadius={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="catogories-container">
      <div className="catagories-header">
        <div className="categories-income__title">{title}</div>
        <CircleProgressBar
          percentage={activeSlide - 1}
          circleWidth={30}
          max={(catogoryitems?.length || 0) - 2}
        />
      </div>
      <motion.div className="categories-income">
        <motion.div
          ref={carousal}
          drag={gridToggle || catGridToggle ? undefined : "x"}
          dragConstraints={{
            left: -(FALLBACK_WIDTH * ((catogoryitems?.length || 0) - 1)),
            right: FALLBACK_WIDTH,
          }}
          className={`${gridToggle || catGridToggle ? "grid" : "card-container "}`}
          style={{
            x: animatedX,
          }}
          onMouseMove={({ currentTarget, clientX, clientY }) => {
            const parent = currentTarget.offsetParent;
            if (!parent || gridToggle || catGridToggle) return;
            const { left, top } = parent.getBoundingClientRect();
            mouseX.set(clientX - left - CURSOR_SIZE / 2);
            mouseY.set(clientY - top - CURSOR_SIZE / 2);
          }}
          onDragStart={() => {
            if (gridToggle || catGridToggle) return;
            carousal.current?.setAttribute("data-dragging", "true");
            setIsDragging(true);
          }}
          onDragEnd={(_e, info) => {
            if (gridToggle || catGridToggle) return;
            handleDragSnap(info);
          }}
        >
          {catogoryitems !== undefined &&
            catogoryitems.map((item, index) => {
              return (
                <CarouselItem
                  key={index}
                  index={index}
                  item={item}
                  itemsRef={itemsRef}
                  handleShow={handleShow}
                  handleDelete={handleDelete}
                />
              );
            })}
        </motion.div>
      </motion.div>
      <motion.button
        type="button"
        className="navigation-btn left-btn"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        initial={{ opacity: 0 }}
        animate={{
          opacity:
            activeSlide - 1 <= 0 ||
            !canScrollPrev ||
            gridToggle ||
            catGridToggle
              ? 0
              : 1,
        }}
        whileHover={{
          scale: 1.5,
          opacity: activeSlide - 1 <= 0 || !canScrollPrev ? 0 : 1,
          cursor:
            activeSlide - 1 <= 0 || !canScrollPrev ? "default" : "pointer",
        }}
      >
        <BiChevronLeftCircle />
      </motion.button>
      <motion.button
        type="button"
        className="navigation-btn right-btn"
        onClick={scrollNext}
        disabled={!canScrollNext}
        initial={{ opacity: 0 }}
        animate={{
          opacity:
            activeSlide - 1 <= 0 ||
            !canScrollNext ||
            gridToggle ||
            catGridToggle
              ? 0
              : 1,
        }}
        whileHover={{
          scale: 1.5,
          opacity: activeSlide - 1 <= 0 || !canScrollNext ? 0 : 1,
          cursor:
            activeSlide - 1 <= 0 || !canScrollNext ? "default" : "pointer",
        }}
      >
        <BiChevronRightCircle />
      </motion.button>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {show ? (
          <CatagoriesModal
            show={show}
            setShow={setShow}
            type="category"
            action={ACTIONS.UPDATE}
            updateData={editData !== false ? editData : undefined}
          />
        ) : (
          showDeleteAlert &&
          deleteData !== false &&
          deleteData._id && (
            <DeleteCategoryModal
              show={showDeleteAlert}
              setShow={setShowDeleteAlert}
              deleteData={
                deleteData as {
                  _id: string;
                  title: string;
                  color?: string;
                  background?: string;
                  icon?: string;
                }
              }
            />
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarouselSlider;
