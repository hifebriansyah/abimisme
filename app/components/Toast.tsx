import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const ToastContext = createContext<(message: string) => void>(() => {});

/** `const say = useToast(); say("Disalin")` shows a short message at the top of the screen. */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const say = useCallback((text: string) => {
    setMessage(text);
    setShown(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShown(false), 1800);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <ToastContext.Provider value={say}>
      {children}
      <Toast message={message} shown={shown} />
    </ToastContext.Provider>
  );
}

export function Toast({ message, shown }: { message: string; shown: boolean }) {
  return (
    <div className={`toast${shown ? " show" : ""}`} role="status">
      {message}
    </div>
  );
}
