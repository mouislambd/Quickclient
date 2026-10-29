import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", hoverEffect = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm ${
        hoverEffect ? "transition-all duration-200 hover:shadow-md hover:border-slate-300" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
