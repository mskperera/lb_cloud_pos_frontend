import React, { useEffect } from "react";

export default function ToastPopup({ summary, detail, severity }) {
  const toastSeverityStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  const toastStyle = toastSeverityStyles[severity] || "bg-gray-500 text-white";

  return (
    <div
      className={`toast fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded shadow-lg ${toastStyle}`}
      role="alert"
    >
      <div className="font-bold">{summary}</div>
      <div>{detail}</div>
    </div>
  );
}

export const showToastBottomCenter = () => {
  return (
    <ToastPopup
      summary="Example Summary"
      detail="This is an example detail."
      severity="error"
    />
  );
};
