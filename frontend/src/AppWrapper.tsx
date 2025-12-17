import React from "react";
import App from "./App";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import ErrorPage from "./pages/error/ErrorPage";
import { Provider } from "react-redux";
import NetworkStatusListener from "./app/NetworkListner";
import { store } from "./app/store";
import { useHealthCheck } from "./hooks/useHealthCheck";

const AppWrapper: React.FC = () => {
  const apiUrl = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL as string)
    : "http://localhost:3000";

  const { isServerConnected, isDbConnected, isLoading } = useHealthCheck({
    baseUrl: apiUrl,
    initialCheckInterval: 30000,
    maxCheckInterval: 300000,
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          flexDirection: "column",
        }}
      >
        <div>Connecting to server...</div>
        <div style={{ fontSize: "14px", marginTop: "10px", color: "#666" }}>
          {apiUrl}
        </div>
      </div>
    );
  }

  const getConnectionError = () => {
    if (isServerConnected === false) {
      return new Error("Server Connection Lost");
    }
    if (isDbConnected === false) {
      return new Error("Database Connection Lost");
    }
    return null;
  };

  const connectionError = getConnectionError();

  if (connectionError) {
    return (
      <ErrorPage
        error={connectionError}
        resetErrorBoundary={() => window.location.reload()}
      />
    );
  }

  return (
    <ErrorBoundary
      fallbackRender={(props: FallbackProps) => {
        return (
          <ErrorPage
            error={props.error}
            resetErrorBoundary={props.resetErrorBoundary}
          />
        );
      }}
    >
      <Provider store={store}>
        <NetworkStatusListener />
        <App />
      </Provider>
    </ErrorBoundary>
  );
};

export default AppWrapper;
