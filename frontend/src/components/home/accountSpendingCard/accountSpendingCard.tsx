import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./accountSpendingCard.scss";
import Card from "../../common/card/Card";
import { Pagination } from "swiper/modules";
import { MdAdd } from "react-icons/md";
import type { AccountSpendingProps } from "./types";
import { useCurrency } from "../../../utils/currency";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AccountSpendingCard: React.FC<AccountSpendingProps> = ({
  dashboard,
  currentSlide,
  handleSlideChange,
  navigate,
  isLoading,
}) => {
  const { symbol } = useCurrency();

  if (isLoading) {
    return (
      <Card>
        <div className="account-card">
          <div className="account-spending-container">
            <div className="account-container">
              <Card className="box-shadow">
                <div className="card-padding">
                  <Skeleton height={80} width={"100%"} borderRadius={16} />
                </div>
              </Card>
            </div>
            <div className="earning-spending-container">
              <div className="earning">
                <Card className="box-shadow">
                  <div className="card-padding">
                    <Skeleton height={48} width={80} />
                    <Skeleton height={32} width={60} style={{ marginTop: 8 }} />
                  </div>
                </Card>
              </div>
              <div className="spending">
                <Card className="box-shadow">
                  <div className="card-padding">
                    <Skeleton height={48} width={80} />
                    <Skeleton height={32} width={60} style={{ marginTop: 8 }} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="account-card">
        {dashboard?.accountDetails && dashboard.accountDetails.length > 0 ? (
          <div className="account-spending-container">
            <div className="account-container">
              <Card className="box-shadow">
                <div className="card-padding">
                  <div className="account">
                    <Swiper
                      pagination={{ dynamicBullets: true }}
                      modules={[Pagination]}
                      onSlideChange={handleSlideChange}
                      style={{ width: "100%" }}
                      slidesPerView={1}
                      spaceBetween={0}
                      loop={false}
                    >
                      {dashboard.accountDetails.map((item, index) => (
                        <SwiperSlide key={index} style={{ width: "100%" }}>
                          <div className="account-top">
                            <div className="top flex-grow">
                              <h3 className="account-top__h3">Account Type</h3>
                              <h2 className="account-top__h2">{item?.title}</h2>
                            </div>
                            <div className="top account-amount">
                              <h1 className="account-amount__h1">
                                {item?.balance}
                              </h1>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div className="account-bottom"></div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="earning-spending-container">
              <div className="earning">
                <Card className="box-shadow">
                  <div className="card-padding">
                    <div className="top">
                      <h3>Earnings</h3>
                    </div>
                    <div className="top margin-top">
                      <h2>
                        {symbol}
                        {Math.abs(
                          dashboard.accountDetails[currentSlide]?.totalIncome
                        ) || 0}
                      </h2>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="spending">
                <Card className="box-shadow">
                  <div className="card-padding">
                    <div className="top">
                      <h3>Spendings</h3>
                    </div>
                    <div className="top margin-top">
                      <h2>
                        {symbol}
                        {Math.abs(
                          dashboard.accountDetails[currentSlide]?.totalExpense
                        ) || 0}
                      </h2>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-placeholder">
            <div className="account-top">
              <h2>Accounts</h2>
            </div>
            <div className="account-widget-container">
              <h3>Oops, no accounts found!</h3>
              <p>
                Time to create one before your money vanishes into thin air.
                ✨💸
              </p>
            </div>
            <div
              className="account-bottom"
              onClick={() => navigate("/wallets")}
            >
              <button className="account-add-icon">
                <MdAdd />
              </button>
              <h4>✨ Get started—add an account now!</h4>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AccountSpendingCard;
