import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MainContent from "./MainContent";

const DashboardLayout: React.FC = () => {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="w-full">
                <Header />
            </div>

            {/* Layout chính */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (Cố định bên trái) */}
                <Sidebar />

                {/* Nội dung chính có thể cuộn */}
                <MainContent>
                    <Outlet />
                </MainContent>
            </div>

            <div>
                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;
