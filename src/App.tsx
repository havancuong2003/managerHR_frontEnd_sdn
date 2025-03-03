import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login, Register, NotFound, Forbidden403 } from "./pages";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Employee from "./pages/employee";

function App() {
    return (
        <Router basename="/managerHR">
            <Routes>
                {/* Các trang không có Dashboard Layout */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forbidden" element={<Forbidden403 />} />

                {/* Group các trang có DashboardLayout */}
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="employees" element={<Employee />} />
                </Route>

                {/* Trang 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
