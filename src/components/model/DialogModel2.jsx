import CloseButton from "../buttons/CloseButton";


const DialogModel2 = ({ onHide, children, title, isVisible, hideCloseButton = false }) => {
  
  if (isVisible === false) return null;
    return (
  
            <div className="fixed inset-0 z-50 flex items-center justify-center p-1 xs:p-2 sm:p-4" onClick={(e) => e.target === e.currentTarget && onHide()} overflow-hidden>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Main Panel */}
      <div className="relative w-full h-full lg:h-auto lg:max-w-7xl lg:max-h-[92vh] bg-white rounded-none lg:rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header - Responsive */}
             <div className="flex items-center justify-between py-1 pl-6 pr-2 border-b border-gray-300 bg-gray-200 text-gray-600">
          <h2 className="text-base xs:text-lg sm:text-xl lg:text-lg font-bold truncate">{title}</h2>
     
      {!hideCloseButton && <CloseButton onClick={onHide} />}
        </div>

  
     <>
     {children}
     </>
     
      </div>
    </div>
    );
}
export default DialogModel2;