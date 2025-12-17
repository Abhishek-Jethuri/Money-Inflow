import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import "./wallets.scss";
import { MdAdd } from "react-icons/md";
import { getAccounts } from "../../features/account/accountSlice";
import { ACTIONS } from "../../constants/constants";
import type { Account } from "../../features/account/types";
import AccountModal from "../../components/accounts/accountModal/AccountModal";
import AccountCard from "../../components/accounts/accountCard/AccountCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DeleteAccountModal from "../../components/common/modal/DeleteAccountModal/DeleteAccountModal";

interface AccountModalData {
  _id: string;
  title: string;
  initialAmount: number;
  amount: number;
  icon: string;
  isIncome?: boolean;
  numberOfTransactions?: number;
  [key: string]: string | number | boolean | undefined;
}

const Wallets: React.FC = () => {
  const account = useAppSelector((state) => state.account.account);
  const isLoading = useAppSelector((state) => state.account.isLoading);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [editData, setEditData] = useState<Account | null>(null);
  const [deleteData, setDeleteData] = useState<Account | null>(null);

  const dispatch = useAppDispatch();
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    dispatch(getAccounts()).unwrap();
  }, [dispatch]);

  const handleCreate = (): void => {
    setShowCreateModal(true);
  };

  const handleShow = (item: Account): void => {
    setEditData(item);
    setShow(true);
  };

  const handleDelete = (item: Account): void => {
    setDeleteData(item);
    setShowDeleteAlert(true);
  };

  const transformForModal = (account: Account): AccountModalData => ({
    _id: account._id,
    title: account.title,
    initialAmount: account.initialAmount || account.amount || 0,
    amount: account.amount || 0,
    icon: account.icon || "WALLET",
    isIncome: false,
    numberOfTransactions: account.numberOfTransactions || 0,
  });

  if (isLoading) {
    return (
      <div className="accounts-container">
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <Skeleton height={120} borderRadius={20} />
          </div>
        ))}
        <div style={{ position: "fixed", bottom: 20, right: 20 }}>
          <Skeleton width={60} height={60} borderRadius={30} />
        </div>
      </div>
    );
  }

  return (
    <div className="accounts-container">
      {account.length === 0 ? (
        <div>No accounts found. Create your first account!</div>
      ) : (
        account.map((item, index) => {
          return (
            <AccountCard
              key={index}
              index={index}
              item={item}
              itemsRef={itemsRef}
              handleShow={handleShow}
              handleDelete={handleDelete}
              isBGImage={false}
            />
          );
        })
      )}
      <button className="accounts-add-icon" onClick={handleCreate}>
        <MdAdd />
      </button>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showCreateModal ? (
          <AccountModal
            show={showCreateModal}
            setShow={setShowCreateModal}
            type={"account"}
            action={ACTIONS.CREATE}
            updateData={undefined}
          />
        ) : show ? (
          <AccountModal
            show={show}
            setShow={setShow}
            action={ACTIONS.UPDATE}
            updateData={editData ? transformForModal(editData) : undefined}
            type={"account"}
          />
        ) : (
          showDeleteAlert &&
          deleteData && (
            <DeleteAccountModal
              show={showDeleteAlert}
              setShow={setShowDeleteAlert}
              deleteData={deleteData}
            />
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallets;
