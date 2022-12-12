import React from "react";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

function Button({ children, onClick, disabled }: Props) {
  return (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
