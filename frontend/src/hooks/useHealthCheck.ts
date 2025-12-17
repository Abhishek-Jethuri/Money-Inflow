import { useState, useEffect, useCallback } from "react";
import axiosConfig from "../app/axiosConfig";

interface HealthCheckOptions {
  baseUrl: string;
  initialCheckInterval?: number;
  maxCheckInterval?: number;
  timeoutDuration?: number;
}

export const useHealthCheck = ({
  initialCheckInterval = 30000, // 30 seconds
  maxCheckInterval = 300000, // 5 minutes
  timeoutDuration = 5000, // 5 seconds
}: HealthCheckOptions) => {
  const [isServerConnected, setIsServerConnected] = useState<boolean | null>(
    null
  );
  const [isDbConnected, setIsDbConnected] = useState<boolean | null>(null);
  const [checkInterval, setCheckInterval] = useState(initialCheckInterval);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "/api/v1/";

  // Exponential backoff calculation

  const performHealthCheck = useCallback(async () => {
    const calculateBackoff = (failures: number) => {
      const baseBackoff = Math.min(
        maxCheckInterval,
        initialCheckInterval * Math.pow(2, failures)
      );

      const jitter = Math.random() * baseBackoff * 0.2;
      return baseBackoff + jitter;
    };

    try {
      const response = await axiosConfig.get(`${API_URL}healthCheck`, {
        timeout: timeoutDuration,
      });

      setIsServerConnected(true);
      setIsDbConnected(response.data?.data?.database?.status === "Connected");
      setConsecutiveFailures(0);
      setCheckInterval(initialCheckInterval);
    } catch (error) {
      console.warn("Health check failed:", error);

      setIsServerConnected(false);
      setIsDbConnected(false);

      const newFailures = consecutiveFailures + 1;
      setConsecutiveFailures(newFailures);

      const newInterval = calculateBackoff(newFailures);
      setCheckInterval(newInterval);
    } finally {
      setIsLoading(false);
    }
  }, [
    consecutiveFailures,
    initialCheckInterval,
    timeoutDuration,
    maxCheckInterval,
  ]);

  useEffect(() => {
    performHealthCheck();
  }, [performHealthCheck]);

  useEffect(() => {
    if (isLoading) return;

    const intervalId = setInterval(performHealthCheck, checkInterval);
    return () => clearInterval(intervalId);
  }, [checkInterval, performHealthCheck, isLoading]);

  return {
    isServerConnected,
    isDbConnected,
    checkInterval,
    consecutiveFailures,
    isLoading,
    manualHealthCheck: performHealthCheck,
  };
};
