import React from "react";
import "./alertModal.scss";
import Modal from "../Modal";
import Icon from "../../icon/Icon";
import { ICONS } from "../../../../constants/constants";

interface AlertModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onDelete: () => void;
  title: string;
  entityName: string;
  color?: string;
  background?: string;
  icon?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  show,
  setShow,
  onDelete,
  title,
  entityName,
  color = "var(--purple-100)",
  background,
  icon,
}) => {
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onDelete();
      setShow(false);
    } catch (_error) {
      setShow(true);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal isOpen={show} onClose={handleClose} animate="diffuse">
      <div
        className="alert-modal-left"
        style={{
          backgroundImage: `url("src/assets/backdrops/${
            background || "Saly-3"
          }.png")`,
          backgroundColor: color,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "bottom",
        }}
      >
        <Modal.Header>
          {
            // Conditionally rendered if isCategory
            <div
              className="icon-container"
              style={{
                color: color,
              }}
            >
              <Icon
                icon={ICONS[icon as keyof typeof ICONS]}
                color={color}
                size={40}
              ></Icon>
            </div>
          }
        </Modal.Header>
      </div>

      <form onSubmit={onSubmit} className="alert-modal-form">
        <div className="alert-modal-right">
          <Modal.Body isRight={true}>
            <div className="alert-modal-body">
              <div>
                <span>
                  Delete <b style={{ color: color }}>{title}</b>
                </span>
              </div>
              <div>
                <span style={{ color: "var(--gray-100)" }}>
                  Do you really want to delete{" "}
                  <b style={{ color: color }}>{title}</b> {entityName} ?
                </span>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Modal.DismissButton className="btn btn-secondary">
              Cancel
            </Modal.DismissButton>
            <button type="submit" className="btn btn-primary">
              Delete
            </button>
          </Modal.Footer>
        </div>
      </form>
    </Modal>
  );
};

export default AlertModal;
