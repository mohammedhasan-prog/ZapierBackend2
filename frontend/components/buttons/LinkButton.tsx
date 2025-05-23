"use client";
import React from "react";

const LinkButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return <div  onClick={onClick} className="px-4 py-2 cursor-pointer hover:rounded-md hover:bg-gray-200">
    {children}
  </div>;
};

export default LinkButton;
