import React from "react";

interface AuthorizeButtonProps {
  onClick: () => void;
}

const AuthorizeButton: React.FC<AuthorizeButtonProps> = ({ onClick }) => {
  return (
    <div className="flex flex-col grow mt-16  text-center   text-[#0b3864] whitespace-nowrapmax-md:mt-10">
      <button
        onClick={onClick}
        className="px-11 py-1.5 rounded-xl bg-[#f7bd45] hover:bg-[#f7d38a] max-md:px-5 text-sm font-semibold"
      >
        Authorize
      </button>
    </div>
  );
};

export default AuthorizeButton;
