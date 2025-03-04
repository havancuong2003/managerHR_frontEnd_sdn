import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login, Register, NotFound, Forbidden403 } from "./pages";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Employee from "./pages/employee";
import PrivateRoutes from "./components/private_routes";
import InfoEmployee from "./pages/info_employee";

function App() {
    return (
        <Router basename="/managerHR">
            <Routes>
                {/* Các trang không có Dashboard Layout */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forbidden" element={<Forbidden403 />} />

                {/* Group các trang có Private Route trước khi vào layout */}
                <Route
                    element={
                        <PrivateRoutes rolesAccess={["admin", "employee"]} />
                    }
                >
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                    </Route>
                </Route>
                <Route element={<PrivateRoutes rolesAccess={["admin"]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="employees" element={<Employee />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoutes rolesAccess={["employee"]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="employee/:id" element={<InfoEmployee />} />
                    </Route>
                </Route>

                {/* Trang 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
