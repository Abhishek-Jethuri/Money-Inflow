import React from "react";
import "./profileCard.scss";
import Card from "../../common/card/Card";
import type { ProfileCardProps } from "./types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppSelector } from "../../../app/hooks";

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatar,
  userProfile,
  user,
  isLoading,
}) => {
  const dashboard = useAppSelector((state) => state.dashboard.dashboard);

  if (isLoading) {
    return (
      <Card>
        <div className="card-padding">
          <div className="profile-pic">
            <div className="avatar">
              <Skeleton circle width={64} height={64} />
            </div>
          </div>
          <div className="profile-name-loc">
            <h2>
              <Skeleton width={120} />
            </h2>
            <div className="profile-location">
              <h3>
                <Skeleton width={100} />
              </h3>
            </div>
          </div>
          <div className="profile-info">
            {[...Array(3)].map((_, i) => (
              <label className="profile-expense-category" key={i}>
                <span className="profileInfoNum">
                  <Skeleton width={60} />
                </span>
                <span className="profileInfoTitle">
                  <Skeleton width={80} />
                </span>
              </label>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="card-padding">
        <div className="profile-pic">
          <div className="avatar">
            <img className="profile-avatar" src={avatar} alt="Profile Avatar" />
          </div>
        </div>
        <div className="profile-name-loc">
          <h2>{user ? user.name : userProfile?.userPersona || "User"}</h2>
          <div className="profile-location">
            <h3>
              {dashboard && dashboard.totalTransactionsCount > 0
                ? userProfile?.userPersona
                : "The Rising Star ✨"}
            </h3>
          </div>
        </div>
        <div className="profile-info">
          <label className="profile-expense-category">
            <span className="profileInfoNum">
              {userProfile?.categoryWithMostSpent?.categoryName || "Zero"}
            </span>
            <span className="profileInfoTitle">Spent most on</span>
          </label>
          <label className="profile-transactions">
            <span className="profileInfoNum">
              {dashboard?.totalTransactionsCount || "Zilch"}
            </span>
            <span className="profileInfoTitle">Transactions</span>
          </label>
          <label className="profile-savings-rate">
            <span className="profileInfoNum">
              {dashboard?.savingsRate || "Nada"}
            </span>
            <span className="profileInfoTitle">Savings Rate</span>
          </label>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
