import React from "react";

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            <nav className="flex flex-col space-y-2">
                <a href="#" className="hover:bg-gray-700 p-2 rounded">
                    Dashboard
                </a>
                <a href="#" className="hover:bg-gray-700 p-2 rounded">
                    Employees
                </a>
                <a href="#" className="hover:bg-gray-700 p-2 rounded">
                    Settings
                </a>
            </nav>
        </aside>
    );
};

export default Sidebar;
