import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    loading?: boolean;
    className?: string; // Thêm className tùy chỉnh
    onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
    children,
    type = "button",
    variant = "primary",
    size = "medium",
    disabled = false,
    loading = false,
    className = "", // Giá trị mặc định
    onClick,
}) => {
    const baseStyle =
        "rounded-md font-semibold focus:outline-none transition-all";
    const sizeStyles = {
        small: "px-3 py-1 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-5 py-3 text-lg",
    };
    const variantStyles = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
    };

    return (
        <button
            type={type}
            className={`${baseStyle} ${sizeStyles[size]} ${
                variantStyles[variant]
            } ${
                disabled || loading ? "opacity-50 cursor-not-allowed" : ""
            } ${className}`} // Gộp thêm className từ props
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading ? "Đang xử lý..." : children}
        </button>
    );
};

export default Button;
