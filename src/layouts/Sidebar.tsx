import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Sidebar: React.FC = () => {
    // Lấy userId và role từ Redux
    const { userId, role } = useSelector((state: RootState) => state.auth);

    const menuItems = [
        { name: "Dashboard", link: "/dashboard", roles: ["admin", "employee"] },
        {
            name: "Thông tin các nhân viên",
            link: "/employees",
            roles: ["admin"],
        },
        {
            name: "Thông tin cá nhân",
            link: userId ? `/employee/${userId}` : "#", // Nếu userId null thì không điều hướng
            roles: ["employee"],
        },

        {
            name: "Time Checking",
            link: "/time-checking",
            roles: ["admin", "employee"],
        },
        {
            name: "Leave Request",
            link: "/leave-request",
            roles: ["admin", "employee"],
        },
        {
            name: "Salary",
            link: "/salary",
            roles: ["admin", "employee"],
        },
        { name: "Lịch sử hoạt động", link: "/activitylogs", roles: ["admin"] },
        {
            name: "Department Time Checking",
            link: "/manage-time-checking",
            roles: ["admin"],
        },
        {
            name: "Department Leave Request",
            link: "/manage-leave-request",
            roles: ["admin"],
        },
        {
            name: "Department Management",
            link: "/manage-department",
            roles: ["admin"],
        },
        {
            name: "Department Bonus Salary",
            link: "/manage-bonus-salary",
            roles: ["admin"],
        },
        {
            name: "Department Salary",
            link: "/manage-salary",
            roles: ["admin"],
        },
    ];

    return (
        <aside className="w-64 h-[calc(100vh-8rem)] bg-gray-800 text-white fixed left-0 top-16 p-4">
            <h2 className="text-xl font-bold mb-4">Danh sách các mục</h2>
            <nav className="flex flex-col space-y-2">
                {menuItems
                    .filter((item) => item.roles.includes(role || "")) // Kiểm tra quyền
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
