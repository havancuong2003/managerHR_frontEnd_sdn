import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth/auth.service";
import { clearAuth } from "../redux/reducers/authReducer";

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser(); // ✅ Gọi API để logout
        } catch (error) {
            console.error("Lỗi khi logout:", error);
        }

        // ✅ Xóa token khỏi Redux & localStorage
        dispatch(clearAuth());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");

        // ✅ Chuyển hướng về trang login
        navigate("/login");
    };

    return (
        <header className="w-full h-16 bg-blue-600 text-white flex items-center justify-between px-4 shadow-md fixed top-0 left-0 z-50">
            <h1 className="text-lg font-bold">Dashboard</h1>

            {/* Nút Logout */}
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
            >
                Đăng xuất
            </button>
        </header>
    );
};

export default Header;
