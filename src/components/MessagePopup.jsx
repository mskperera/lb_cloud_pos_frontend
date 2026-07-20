import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

const variantStyles = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    titleColor: "text-emerald-900",
    textColor: "text-emerald-700",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    titleColor: "text-amber-900",
    textColor: "text-amber-700",
  },
  danger: {
    icon: AlertCircle,
    border: "border-rose-200",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    titleColor: "text-rose-900",
    textColor: "text-rose-700",
  },
  info: {
    icon: Info,
    border: "border-sky-200",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    titleColor: "text-sky-900",
    textColor: "text-sky-700",
  },
};

const MessagePopup = ({
  isOpen,
  onClose,
  type = "info",
  title = "Notice",
  message = "",
  confirmText = "Close",
}) => {
  if (!isOpen) return null;

  const config = variantStyles[type] || variantStyles.info;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl border ${config.border} bg-white shadow-2xl overflow-hidden`}>
        <div className={`flex items-start justify-between px-5 py-4 border-b ${config.border} bg-slate-50/80`}>
          <div className="flex items-start gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${config.iconBg}`}>
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${config.titleColor}`}>{title}</h3>
              <p className={`text-sm ${config.textColor}`}>Please review the details below.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="text-sm leading-6 text-slate-700">{message}</p>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition ${
                type === "danger"
                  ? "bg-rose-600 text-white hover:bg-rose-700"
                  : type === "warning"
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : type === "success"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-sky-600 text-white hover:bg-sky-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePopup;
