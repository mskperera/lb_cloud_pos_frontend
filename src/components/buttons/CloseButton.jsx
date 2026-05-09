import { XIcon } from "lucide-react";

const CloseButton = ({ onClick,size }) => {
  return (
    <button 
      onClick={onClick} 
      className="p-1.5 xs:p-2 sm:p-3 rounded-full hover:bg-slate-100 hover:text-red-500 transition-all duration-200 touch-manipulation flex-shrink-0 ml-2"
      aria-label="Close"
    >
      <XIcon size={size || 16} strokeWidth={3} />
    </button>
  );
};

export default CloseButton;



