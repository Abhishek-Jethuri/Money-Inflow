import React, { useState } from "react";
import { motion } from "framer-motion";
import "./accountCard.scss";
import { ICONS } from "../../../constants/constants";
import Icon from "../../common/icon/Icon";
import { useCurrency } from "../../../utils/currency";
import type { Account } from "../../../features/account/types";

interface AccountCardProps {
  item: Account;
  index: number;
  itemsRef: React.MutableRefObject<(HTMLElement | null)[]>;
  handleShow: (item: Account) => void;
  handleDelete: (item: Account) => void;
  isBGImage?: boolean;
}

const AccountCard: React.FC<AccountCardProps> = ({
  item,
  index,
  itemsRef,
  handleShow,
  handleDelete,
}) => {
  const { format } = useCurrency();
  const [showIcons, setShowIcons] = useState(false);

  const showActionIcons = (isShow: boolean) => {
    setShowIcons(isShow);
  };

  return (
    <div>
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
        className="account-widget"
        transition={{
          ease: "easeInOut",
          duration: 0.4,
        }}
        style={{
          background:
            "linear-gradient(135deg, #868cff 0%, var(--purple-200) 100%)",
        }}
      >
        <div className="account-wrapper" draggable={false}>
          <div className="account-top">
            <h2 className="title">{item.title}</h2>
            <Icon
              icon={ICONS[item.icon as keyof typeof ICONS]}
              color={"white"}
            ></Icon>
          </div>

          <div className="account-bottom">
            <h1 lang="de" className="amount">
              {format(item.amount || 0)}
            </h1>
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
    </div>
  );
};

export default AccountCard;
