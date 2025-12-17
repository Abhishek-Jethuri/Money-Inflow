import React, { useState } from "react";
import "./carouselItem.scss";
import { motion } from "framer-motion";
import { ICONS } from "../../../../constants/constants";
import Icon from "../../icon/Icon";

interface CategoryUpdateData {
  _id?: string;
  title: string;
  icon: string;
  color: string;
  background: string;
  isIncome?: boolean;
}

interface CarouselItemProps {
  item: CategoryUpdateData;
  index: number;
  itemsRef: React.MutableRefObject<(HTMLElement | null)[]>;
  handleShow: (item: CategoryUpdateData) => void;
  handleDelete: (item: CategoryUpdateData) => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  item,
  index,
  itemsRef,
  handleShow,
  handleDelete,
}) => {
  const [showIcons, setShowIcons] = useState(false);

  const showActionIcons = (isShow: boolean) => {
    setShowIcons(isShow);
  };

  return (
    <motion.div
      id={index.toString()}
      key={index}
      tabIndex={index}
      ref={(el) => {
        if (el) itemsRef.current[index] = el;
      }}
      whileHover={{ cursor: "pointer" }}
      onMouseEnter={() => showActionIcons(true)}
      onMouseLeave={() => showActionIcons(false)}
      whileTap={{ cursor: "grabbing" }}
      className="category-widget saly1"
      transition={{
        ease: "easeInOut",
        duration: 0.4,
      }}
      style={{
        backgroundImage: `url(src/assets/backdrops/${item.background}.png)`,
        backgroundColor: `${item.color}`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "right top",
      }}
    >
      <div className="category-left" draggable={false}>
        <div className="category-top">
          <div
            className="icon-container icon"
            style={{
              color: `${item.color}`,
            }}
          >
            <Icon
              icon={ICONS[item.icon as keyof typeof ICONS]}
              color={item.color}
            ></Icon>
          </div>
        </div>
        <div className="category-bottom">
          <h3 lang="de" className="title">
            {item.title}
          </h3>
        </div>
        {showIcons && (
          <div className="carousel-hover-overlay">
            <div className="carousel-hover-wrapper">
              <div className="carousel-hover-content">
                <motion.button
                  key="delete"
                  className="carousel-hover-btn"
                  whileHover={{ scale: 1.5 }}
                  onClick={() => handleDelete(item)}
                >
                  <Icon icon={ICONS.DELETE} color={"white"} size={48}></Icon>
                </motion.button>
                <motion.button
                  key="edit"
                  whileHover={{ scale: 1.5 }}
                  className="carousel-hover-btn"
                  onClick={() => handleShow(item)}
                >
                  <Icon icon={ICONS.EDIT} color={"white"} size={48}></Icon>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CarouselItem;
