import { useState, useEffect, useCallback } from "react";

interface UseSplashScreenOptions {
  initialMessage?: string;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const useSplashScreen = (options: UseSplashScreenOptions = {}) => {
  const {
    initialMessage = "Loading...",
    autoHide = false,
    autoHideDelay = 2000,
  } = options;

  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState(initialMessage);
  const [isLoading, setIsLoading] = useState(true);

  const show = useCallback((newMessage?: string) => {
    setIsVisible(true);
    setIsLoading(true);
    if (newMessage) {
      setMessage(newMessage);
    }
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
    setIsLoading(false);
  }, []);

  const updateMessage = useCallback((newMessage: string) => {
    setMessage(newMessage);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        hide();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, isVisible, hide]);

  return {
    isVisible,
    message,
    isLoading,
    show,
    hide,
    updateMessage,
    setLoading,
  };
};
