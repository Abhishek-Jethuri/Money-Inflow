import type { FallbackProps } from "react-error-boundary";
import BackdropExpense from "../../assets/backdrops/error1.mp4";
import "./ErrorPage.scss";

const ErrorPage = (props: FallbackProps) => {
  const { error, resetErrorBoundary } = props;

  const getErrorMessage = () => {
    const errorMessages: { [key: string]: string } = {
      "Database Connection Lost":
        "Our database is currently unavailable. Please try again later.",
      "Network Error":
        "Our servers are lost in space. We'll bring them back soon!",
      "Server Connection Lost":
        "Our servers are lost in space. We'll bring them back soon!",
    };

    if (error?.message && errorMessages[error.message]) {
      return errorMessages[error.message];
    }

    return error?.message || "An unexpected error occurred";
  };

  const handleReset = () => {
    resetErrorBoundary();
    window.location.href = "/login";
  };
  return (
    <div className="error-container">
      <div className="error-wrapper">
        <div className="error-left">
          <div className="error-backdrop">
            <video
              className="error-video"
              src={BackdropExpense}
              autoPlay
              loop
              muted
            />
          </div>
        </div>
        <div className="error-right">
          <div className="error-message-title">Houston, we have a problem.</div>

          <div className="error-message-body">{getErrorMessage()}</div>
          <button className="btn-primary" onClick={handleReset}>
            Try Again
          </button>
          <div className="error-message-bottom">
            {error.message === "Network Error"
              ? "Error Code: 500"
              : error.status
                ? `Error Code: ${error.status}`
                : "Server Lost"}
          </div>
          <div className="blob-cont">
            <div className="yellow blob"></div>
            <div className="red blob"></div>
            <div className="green blob"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
