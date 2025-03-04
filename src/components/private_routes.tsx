import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface PrivateRoutesProps {
    rolesAccess: string[];
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ rolesAccess }) => {
    const userRole = useSelector((state: RootState) => state.auth.role);

    if (!userRole) return <Navigate to="/login" />;

    const isAuthorized = rolesAccess.includes(userRole);
    return isAuthorized ? <Outlet /> : <Navigate to="/forbidden" />;
};

export default PrivateRoutes;
