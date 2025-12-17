import Icon from "../../components/common/icon/Icon";
import { ICONS } from "../../constants/constants";
import type { SidebarOptionType } from "../../data/sidebar";
import "./SidebarOption.scss";

export interface SidebarOptionProps {
  option: SidebarOptionType;
  isActive: boolean;
}

const SidebarOption = ({ option, isActive }: SidebarOptionProps) => {
  return (
    <div
      id={option.id}
      className={isActive ? "sidebar-option isActive" : "sidebar-option"}
    >
      <div className="sidebar-icon">
        <Icon
          icon={ICONS[option.icon]}
          color={isActive ? "var(--purple-200)" : "var(--gray-100)"}
        ></Icon>
      </div>
      <span className="sidebar-title">{option.name}</span>
      {isActive && (
        <div className="sidebar-border-container">
          <span className="sidebar-border"></span>
        </div>
      )}
    </div>
  );
};

export default SidebarOption;
