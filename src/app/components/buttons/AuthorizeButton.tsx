import React from "react";

interface AuthorizeButtonProps {
  onClick: () => void;
}

const AuthorizeButton: React.FC<AuthorizeButtonProps> = ({ onClick }) => {
  return (
    <div className="flex flex-col grow mt-16 text-lg font-medium text-center text-white whitespace-nowrapmax-md:mt-10">
      <button
        onClick={onClick}
        className="px-11 py-1.5 rounded-xl bg-[#f0816c] max-md:px-5 "
      >
        Authorize Access
      </button>
    </div>
  );
};

export default AuthorizeButton;
