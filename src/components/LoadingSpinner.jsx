

const LoadingSpinner = ({loadingMessage}) => {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
        <span className="text-gray-700 text-sm font-medium animate-pulse">{loadingMessage ? loadingMessage :'Loading...'}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
