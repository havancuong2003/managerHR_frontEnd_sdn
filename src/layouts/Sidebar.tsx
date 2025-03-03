import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
    { name: "Dashboard", link: "/dashboard", roles: ["admin", "employee"] },
    { name: "Employees", link: "/employees", roles: ["admin", "employee"] },
    { name: "Settings", link: "/settings", roles: ["admin"] },
];

const currentUserRole = "employee";

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 h-[calc(100vh-8rem)] bg-gray-800 text-white fixed left-0 top-16 p-4">
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            <nav className="flex flex-col space-y-2">
                {menuItems
                    .filter((item) => item.roles.includes(currentUserRole)) // Chỉ hiển thị menu theo quyền
                    .map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.link}
                            className={({ isActive }) =>
                                `p-2 rounded block ${
                                    isActive
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
