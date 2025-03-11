import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="card bg-base-100 shadow-xl p-10 text-center">
        {/* Illustration */}
        <div className="text-9xl font-bold text-error">404</div>
        <h2 className="text-2xl font-semibold mt-4">Oops! Page Not Found</h2>
        <p className="text-gray-500 mt-2">
          The page you are looking for might have been removed or does not exist.
        </p>
        {/* Button to go home */}
        <Link to="/" className="btn btn-primary mt-6">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
