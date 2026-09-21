import React from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X 
} from "lucide-react";

const variants = {
  success: {
    icon: CheckCircle2,
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
  },
  warning: {
    icon: AlertTriangle,
    badgeBg: "bg-amber-50 text-amber-600 border-amber-100",
    buttonBg: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
  },
  danger: {
    icon: XCircle,
    badgeBg: "bg-rose-50 text-rose-600 border-rose-100",
    buttonBg: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
  },
  info: {
    icon: Info,
    badgeBg: "bg-sky-50 text-sky-600 border-sky-100",
    buttonBg: "bg-sky-600 hover:bg-sky-700 focus:ring-sky-500",
  },
};

const MessageBox = ({
  isOpen = true,
  onClose,
  type = "info",
  title = "Notification",
  message = "Action was executed successfully.",
  confirmText = "Close",
  cancelText,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const style = variants[type] || variants.info;
  const Icon = style.icon;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200">
      
      {/* Main Dialog Box */}
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl transition-all transform animate-in fade-in zoom-in-95">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-100">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg border ${style.badgeBg}`}>
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 rounded-md hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Area */}
        <div className="p-5">
          <p className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-slate-100 border-t border-slate-100">
          {cancelText && (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition shadow-sm"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-1.5 text-xs font-semibold text-white rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${style.buttonBg}`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default MessageBox;
// import React from "react";
// import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

// const variantStyles = {
//   success: {
//     icon: CheckCircle2,
//     border: "border-emerald-200",
//     iconBg: "bg-emerald-100",
//     iconColor: "text-emerald-600",
//     titleColor: "text-emerald-900",
//     textColor: "text-emerald-700",
//   },
//   warning: {
//     icon: AlertTriangle,
//     border: "border-amber-200",
//     iconBg: "bg-amber-100",
//     iconColor: "text-amber-600",
//     titleColor: "text-amber-900",
//     textColor: "text-amber-700",
//   },
//   danger: {
//     icon: AlertCircle,
//     border: "border-rose-200",
//     iconBg: "bg-rose-100",
//     iconColor: "text-rose-600",
//     titleColor: "text-rose-900",
//     textColor: "text-rose-700",
//   },
//   info: {
//     icon: Info,
//     border: "border-sky-200",
//     iconBg: "bg-sky-100",
//     iconColor: "text-sky-600",
//     titleColor: "text-sky-900",
//     textColor: "text-sky-700",
//   },
// };

// const MessagePopup = ({
//   isOpen,
//   onClose,
//   type = "info",
//   title = "Notice",
//   message = "",
//   confirmText = "Close",
// }) => {
//   if (!isOpen) return null;

//   const config = variantStyles[type] || variantStyles.info;
//   const Icon = config.icon;

//   return (
//     <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
//       <div className={`w-full max-w-md rounded-3xl border ${config.border} bg-white shadow-2xl overflow-hidden`}>
//         <div className={`flex items-start justify-between px-5 py-4 border-b ${config.border} bg-slate-50/80`}>
//           <div className="flex items-start gap-3">
//             <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${config.iconBg}`}>
//               <Icon className={`h-6 w-6 ${config.iconColor}`} />
//             </div>
//             <div>
//               <h3 className={`text-lg font-semibold ${config.titleColor}`}>{title}</h3>
//               <p className={`text-sm ${config.textColor}`}>Please review the details below.</p>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
//             aria-label="Close dialog"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="px-5 py-5">
//           <p className="text-sm leading-6 text-slate-700">{message}</p>

//           <div className="mt-5 flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition ${
//                 type === "danger"
//                   ? "bg-rose-600 text-white hover:bg-rose-700"
//                   : type === "warning"
//                     ? "bg-amber-600 text-white hover:bg-amber-700"
//                     : type === "success"
//                       ? "bg-emerald-600 text-white hover:bg-emerald-700"
//                       : "bg-sky-600 text-white hover:bg-sky-700"
//               }`}
//             >
//               {confirmText}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessagePopup;
