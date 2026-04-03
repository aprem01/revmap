import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const Icon = icons[toast.type];

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all duration-300 min-w-[320px] ${styles[toast.type]}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(20px)',
      }}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${iconStyles[toast.type]}`} />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }} className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
