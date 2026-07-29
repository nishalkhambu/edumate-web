"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

type Listener = (toast: Toast) => void;

let globalId = 0;
const listeners = new Set<Listener>();

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function notifyListeners(toast: Toast) {
  listeners.forEach((listener) => listener(toast));
}

export function addToast(type: ToastType, message: string) {
  const id = `toast-${Date.now()}-${globalId++}`;
  const toast: Toast = { id, type, message };
  notifyListeners(toast);
  setTimeout(() => {
    listeners.forEach((listener) => listener({ ...toast, id: `${id}-remove` }));
  }, 3000);
}

export const toast = {
  success: (message: string) => addToast("success", message),
  error: (message: string) => addToast("error", message),
  info: (message: string) => addToast("info", message),
};

interface ToastContextType {
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType>({ toasts: [] });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const handleToast = useCallback((toast: Toast) => {
    if (toast.id.endsWith("-remove")) {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id.replace("-remove", "")));
    } else {
      setToasts((prev) => [...prev, toast]);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(handleToast);
    return unsubscribe;
  }, [handleToast]);

  return (
    <ToastContext.Provider value={{ toasts }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
              t.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : t.type === "error"
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                  : "border-indigo-500/40 bg-indigo-500/10 text-indigo-200"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
