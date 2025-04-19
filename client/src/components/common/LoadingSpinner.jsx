const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;