import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login, Register, NotFound, Forbidden403 } from "./pages";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Employee from "./pages/employee";
import PrivateRoutes from "./components/private_routes";
import InfoEmployee from "./pages/info_employee";
import ActivityLogTable from "./pages/activity_logs";
import TimeChecking from "./pages/time_checking";
import ManageTimeChecking from "./pages/manage_time_checking";
import ManageDepartment from "./pages/manage_department";
import LeaveRequest from "./pages/leave_request";
import ManageLeaveRequest from "./pages/manage_leave_request";
import BonusSalaryPage from "./pages/bonus_salary";
import ManageSalaryPage from "./pages/manage_salary";
import SalaryPage from "./pages/salary";
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
                        <Route
                            path="time-checking"
                            element={<TimeChecking />}
                        />
                        <Route
                            path="leave-request"
                            element={<LeaveRequest />}
                        />
                        <Route path="salary" element={<SalaryPage />} />
                    </Route>
                </Route>
                <Route element={<PrivateRoutes rolesAccess={["admin"]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="employees" element={<Employee />} />
                    </Route>

                    <Route path="/" element={<DashboardLayout />}>
                        <Route
                            path="activitylogs"
                            element={<ActivityLogTable />}
                        />
                    </Route>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route
                            path="manage-time-checking"
                            element={<ManageTimeChecking />}
                        />
                    </Route>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route
                            path="manage-department"
                            element={<ManageDepartment />}
                        />
                    </Route>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route
                            path="manage-leave-request"
                            element={<ManageLeaveRequest />}
                        />
                        <Route
                            path="manage-bonus-salary"
                            element={<BonusSalaryPage />}
                        />
                        <Route
                            path="manage-salary"
                            element={<ManageSalaryPage />}
                        />
                    </Route>
                </Route>

                <Route element={<PrivateRoutes rolesAccess={["employee"]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="employee/:id" element={<InfoEmployee />} />
                    </Route>
                    {/* <Route path="/" element={<DashboardLayout />}>
                        <Route
                            path="time-checking"
                            element={<TimeChecking />}
                        />
                    </Route> */}
                </Route>
                {/* Trang 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
