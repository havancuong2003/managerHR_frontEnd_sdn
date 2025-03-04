import React from "react";

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <main className="flex-1  bg-gray-100 pl-72 pt-16 pb-16 h-[calc(100vh-5rem)]">
            {children}
        </main>
    );
};

export default MainContent;
