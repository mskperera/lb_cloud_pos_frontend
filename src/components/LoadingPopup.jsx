  const LoadingPopup = ({text}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-4 border-sky-500 border-opacity-25 rounded-full"></div>
          <div className="absolute inset-0 border-t-4 border-sky-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-700 font-semibold animate-pulse">{text}</p>
      </div>
    </div>
  );
};

export default LoadingPopup;