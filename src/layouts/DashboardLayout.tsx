import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const DashboardLayout: React.FC = () => {
    return (
        <div className="h-screen flex flex-col">
            <div className="w-full">
                <Header />
            </div>

            <div className="flex flex-1">
                <Sidebar />

                <div className="flex-1 overflow-auto p-4 bg-gray-100">
                    <Outlet />
                </div>
            </div>

            <div>
                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;
