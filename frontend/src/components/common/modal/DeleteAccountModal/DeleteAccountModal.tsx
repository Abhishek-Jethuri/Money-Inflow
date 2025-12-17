import React from "react";
import AlertModal from "../alertModal/AlertModal";
import { useAppDispatch } from "../../../../app/hooks";
import { deleteAccount } from "../../../../features/account/accountSlice";

export interface DeleteAccountModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  deleteData: {
    _id: string;
    title: string;
    color?: string;
    background?: string;
    icon?: string;
  };
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  show,
  setShow,
  deleteData,
}) => {
  const dispatch = useAppDispatch();

  return (
    <AlertModal
      show={show}
      setShow={setShow}
      onDelete={() => dispatch(deleteAccount(deleteData._id))}
      title={deleteData.title}
      entityName="account"
      color={deleteData.color}
      background={deleteData.background}
      icon={deleteData.icon}
    />
  );
};

export default DeleteAccountModal;
