import { useEffect, useRef, useState } from "react";

export const useActivityInterceptor = ({
  inactiveTime = 10 * 60 * 1000, // 10 minutes
  countdownTime = 60, // 60 seconds
  onLogout,
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [countdown, setCountdown] = useState(countdownTime);

  const activityTimer = useRef(null);
  const countdownInterval = useRef(null);

  // ✅ Reset inactivity timer
  const resetInactivityTimer = () => {
    setShowPrompt(false);
    setCountdown(countdownTime);

    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }

    if (activityTimer.current) {
      clearTimeout(activityTimer.current);
    }

    activityTimer.current = setTimeout(() => {
      setShowPrompt(true);
    }, inactiveTime);
  };

  // ✅ Start countdown inside modal
  const startCountdown = () => {
    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          onLogout(); // Auto logout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ✅ Setup activity listeners
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    const activityHandler = () => {
      if (!showPrompt) {
        resetInactivityTimer();
      }
    };

    events.forEach((event) => window.addEventListener(event, activityHandler));

    resetInactivityTimer(); // Initial start

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, activityHandler)
      );
      clearTimeout(activityTimer.current);
      clearInterval(countdownInterval.current);
    };
  }, []);

  // ✅ When modal opens → start countdown
  useEffect(() => {
    if (showPrompt) {
      startCountdown();
    }
  }, [showPrompt]);

  // ✅ User chooses "Stay Active"
  const stayActive = () => {
    resetInactivityTimer();
    setShowPrompt(false);
  };

  return {
    showPrompt,
    countdown,
    stayActive,
  };
};
