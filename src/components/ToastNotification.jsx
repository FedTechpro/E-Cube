import { useEffect } from "react";
import {
  CheckCircle,
  X,
  Info,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";

const ToastNotification = ({
  message,
  onClose,
  duration = 3000,
  type = "success",
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const themes = {
    success: {
      icon: <CheckCircle className="text-xl flex-shrink-0" />,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-100",
      iconColor: "text-green-500",
    },
    error: {
      icon: <AlertOctagon className="text-xl flex-shrink-0" />,
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-100",
      iconColor: "text-red-500",
    },
    warning: {
      icon: <AlertTriangle className="text-xl flex-shrink-0" />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-100",
      iconColor: "text-yellow-500",
    },
    info: {
      icon: <Info className="text-xl flex-shrink-0" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-100",
      iconColor: "text-blue-500",
    },
    failed: {
      icon: <X className="text-xl flex-shrink-0" />,
      bgColor: "bg-gray-50",
      textColor: "text-gray-800",
      borderColor: "border-gray-100",
      iconColor: "text-gray-500",
    },
  };

  const theme = themes[type] || themes.success;

  return (
    <div className="fixed z-50 w-full px-3 bottom-4 sm:bottom-6 sm:px-4 md:top-4 md:bottom-auto md:px-0">
      <div
        className={`rounded-lg shadow-lg border ${theme.bgColor} ${theme.borderColor} p-3 sm:p-4 flex items-start mx-auto max-w-full sm:max-w-md`}
      >
        <span className={`mt-0.5 ${theme.iconColor}`}>{theme.icon}</span>
        <span className={`text-sm font-medium ${theme.textColor} mx-3 flex-1`}>
          {message}
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 flex-shrink-0"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
