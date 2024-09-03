import React from "react";

interface AuthorizeButtonProps {
  onClick: () => void;
}

const AuthorizeButton: React.FC<AuthorizeButtonProps> = ({ onClick }) => {
  return (
    <div className="flex flex-col grow mt-16 text-lg font-medium text-center text-white whitespace-nowrap shadow-sm max-md:mt-10">
      <button
        onClick={onClick}
        className="px-11 py-1.5 rounded-xl bg-red-700 bg-opacity-60 shadow-[0px_1px_4px_rgba(12,12,13,0.05)] max-md:px-5 focus:outline-none focus:ring-2 focus:ring-red-700"
      >
        Authorize
      </button>
    </div>
  );
};

export default AuthorizeButton;
