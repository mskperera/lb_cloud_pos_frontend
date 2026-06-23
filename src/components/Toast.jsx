import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ messages, removeToast }) => {
  const getIconAndColors = (severity) => {
    const iconProps = { size: 20, strokeWidth: 2 };
    switch (severity) {
      case 'success':
        return {
          icon: <CheckCircle {...iconProps} />,
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
          textColor: 'text-emerald-900',
          borderColor: 'border-emerald-200',
          iconColor: 'text-emerald-600',
          accentBg: 'bg-emerald-100/50',
        };
      case 'danger':
        return {
          icon: <AlertCircle {...iconProps} />,
          bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
          textColor: 'text-rose-900',
          borderColor: 'border-red-200',
          iconColor: 'text-rose-600',
          accentBg: 'bg-red-100/50',
        };
      case 'warning':
        return {
          icon: <AlertTriangle {...iconProps} />,
          bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
          textColor: 'text-amber-900',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          accentBg: 'bg-amber-100/50',
        };
      case 'info':
      default:
        return {
          icon: <Info {...iconProps} />,
          bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          textColor: 'text-blue-900',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          accentBg: 'bg-blue-100/50',
        };
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
      {messages.map((message, index) => {
        const { icon, bgColor, textColor, borderColor, iconColor, accentBg } = getIconAndColors(message.severity);
        
        return (
          <div
            key={index}
            className={`
              pointer-events-auto
              ${bgColor}
              ${borderColor}
              border
              rounded-2xl
              shadow-lg 
              p-4 
              flex items-start gap-3
              transform transition-all duration-500 ease-out
              animate-[slideUp_0.4s_ease-out]
              hover:shadow-xl hover:scale-[1.02]
            `}
            // style={{
            //   background: `linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)`,
            //   backdropFilter: 'blur(10px)',
            //   WebkitBackdropFilter: 'blur(10px)',
            // }}
          >
            {/* Icon */}
            <div className={`flex-shrink-0 mt-0.5 ${accentBg} rounded-full p-2 flex items-center justify-center`}>
              <div className={iconColor}>
                {icon}
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 ${textColor}`}>
              <p className="font-semibold text-lg leading-snug">
                {message.summary}
              </p>
              {message.detail && (
                <p className="text-md opacity-75 mt-0.5 leading-relaxed">
                  {message.detail}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              className={`
                flex-shrink-0 mt-0.5
                p-1.5 rounded-full
                transition-all duration-200
                hover:bg-white/50
                active:scale-95
              `}
              onClick={() => removeToast(index)}
              aria-label="Close notification"
            >
              <X size={16} className={`${textColor} opacity-60 hover:opacity-100`} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;