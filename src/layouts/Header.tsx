import React from "react";

const Header: React.FC = () => {
    return (
        <header className="w-full h-16 bg-blue-600 text-white flex items-center px-4 shadow-md fixed top-0 left-0 z-50 ">
            <h1 className="text-lg font-bold">Dashboard</h1>
        </header>
    );
};

export default Header;
