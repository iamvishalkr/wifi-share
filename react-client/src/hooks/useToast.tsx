import { useCallback, useEffect, useState } from "react";

export function useToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showToast = useCallback((text: string) => {
    setMessage(text);
  }, []);

  useEffect(() => {
    let tm:number;
    if (message && !isVisible) {
      setIsVisible(true);
      tm = setTimeout(() => {
        setIsVisible(false);
        setMessage("");
      }, 3000);
    }

    return () => {
      clearTimeout(tm);
    };
  }, [message]);

  const Toast = () => {
    return (
      <div className={`snackbar secondary ${isVisible && "active"}`}>
        {message}
      </div>
    );
  };

  return { showToast, Toast };
}
