import React from "react";
import AlertModal from "../alertModal/AlertModal";
import { useAppDispatch } from "../../../../app/hooks";
import { deleteCategory } from "../../../../features/category/categorySlice";

export interface DeleteCategoryModalProps {
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

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  show,
  setShow,
  deleteData,
}) => {
  const dispatch = useAppDispatch();

  return (
    <AlertModal
      show={show}
      setShow={setShow}
      onDelete={() => dispatch(deleteCategory(deleteData._id))}
      title={deleteData.title}
      entityName="category"
      color={deleteData.color}
      background={deleteData.background}
      icon={deleteData.icon}
    />
  );
};

export default DeleteCategoryModal;
