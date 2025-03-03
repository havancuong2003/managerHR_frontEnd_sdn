import React from "react";

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="flex-1 overflow-y-auto p-4">{children}</div>;
};

export default MainContent;
