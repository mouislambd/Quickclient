import React from "react";

export const Spinner: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-slate-200 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
};
