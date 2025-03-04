import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { getAllEmployees } from "../services/commons/employee.service";
import {
    deleteEmployee,
    saveEmployee,
} from "../redux/reducers/employeesReducer";

// Modal Component
import EmployeeModal from "../components/EmployeeModal";
import RegisterModal from "../components/RegisterModal";

// Định nghĩa kiểu dữ liệu nhân viên
interface EmployeeType {
    [key: string]: any; // Thêm index signature
    _id: string;
    fullName: string;
    dob: string;
    gender: string;
    address: string;
    phone: string;
    departmentId: {
        _id: string;
        name: string;
    };
    positionId: {
        _id: string;
        name: string;
    };
    base_salary: number;
    startDate: string;
    avatarUrl: string;
    roleId: {
        _id: string;
        name: string;
    };
}
const Employee = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { employees, loading, error } = useSelector(
        (state: any) => state.employees
    );

    const [editedEmployee, setEditedEmployee] = useState<EmployeeType | null>(
        null
    );
    const [showModal, setShowModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<keyof EmployeeType>("fullName");
    const [sortOrder, setSortOrder] = useState("asc");

    // Gọi API lấy danh sách nhân viên khi render lần đầu
    useEffect(() => {
        dispatch(getAllEmployees());
    }, [dispatch]);

    // Chỉnh sửa thông tin nhân viên
    const handleEdit = (employee: EmployeeType) => {
        setEditedEmployee({ ...employee });
        setShowModal(true);
    };

    // Lưu thông tin nhân viên đã chỉnh sửa
    const handleSave = () => {
        if (editedEmployee) {
            dispatch(saveEmployee(editedEmployee));
            setShowModal(false);
        }
    };

    // Hủy chỉnh sửa
    const handleCancel = () => {
        setEditedEmployee(null);
        setShowModal(false);
    };

    // Xóa nhân viên
    const handleDelete = (id: string) => {
        dispatch(deleteEmployee(id));
    };

    // Cập nhật trường khi chỉnh sửa
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        name: string
    ) => {
        if (editedEmployee) {
            setEditedEmployee({
                ...editedEmployee,
                [name]: e.target.value,
            });
        }
    };

    // Hàm lọc nhân viên
    const filteredEmployees = employees.filter((employee: EmployeeType) =>
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Hàm sắp xếp nhân viên
    const sortedEmployees = filteredEmployees.sort(
        (a: EmployeeType, b: EmployeeType) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : 1;
            } else {
                return aValue > bValue ? -1 : 1;
            }
        }
    );

    return (
        <div className="bg-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Danh Sách Nhân Viên</h2>

            <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-green-500 text-white p-2 rounded mb-4"
            >
                Thêm Nhân Viên
            </button>

            {/* Tìm kiếm */}
            <input
                type="text"
                placeholder="Tìm kiếm theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded mb-4"
            />

            {/* Sắp xếp */}
            <select
                value={sortField}
                onChange={(e) =>
                    setSortField(e.target.value as keyof EmployeeType)
                }
                className="border p-2 rounded mb-4"
            >
                <option value="fullName">Tên</option>
                <option value="dob">Ngày Sinh</option>
                <option value="base_salary">Mức Lương</option>
                <option value="startDate">Ngày Làm Việc</option>
                <option value="phone">Số điện thoại</option>
                <option value="address">Địa Chỉ</option>
                <option value="gender">Giới Tính</option>
            </select>
            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border p-2 rounded mb-4"
            >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
            </select>

            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <table className="w-full table-auto text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border-b-2 p-2">Ảnh</th>
                        <th className="border-b-2 p-2">Tên Nhân Viên</th>
                        <th className="border-b-2 p-2">Ngày Sinh</th>
                        <th className="border-b-2 p-2">Giới Tính</th>
                        <th className="border-b-2 p-2">Địa Chỉ</th>
                        <th className="border-b-2 p-2">Số Điện Thoại</th>
                        <th className="border-b-2 p-2">Phòng Ban</th>
                        <th className="border-b-2 p-2">Chức Vụ</th>
                        <th className="border-b-2 p-2">Mức Lương</th>
                        <th className="border-b-2 p-2">Ngày Bắt Đầu</th>
                        <th className="border-b-2 p-2">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedEmployees.length > 0 ? (
                        sortedEmployees.map((employee: EmployeeType) => (
                            <tr key={employee._id}>
                                <td className="border-b p-2">
                                    <img
                                        src={employee.avatarUrl}
                                        alt={employee.fullName}
                                        className="w-12 h-12 rounded-full"
                                    />
                                </td>
                                <td className="border-b p-2">
                                    {employee.fullName}
                                </td>
                                <td className="border-b p-2">{employee.dob}</td>
                                <td className="border-b p-2">
                                    {employee.gender}
                                </td>
                                <td className="border-b p-2">
                                    {employee.address}
                                </td>
                                <td className="border-b p-2">
                                    {employee.phone}
                                </td>
                                <td className="border-b p-2">
                                    {employee.departmentId.name}
                                </td>
                                <td className="border-b p-2">
                                    {employee.positionId.name}
                                </td>
                                <td className="border-b p-2">
                                    {employee.base_salary}
                                </td>
                                <td className="border-b p-2">
                                    {employee.startDate}
                                </td>
                                <td className="border-b p-2">
                                    <button
                                        onClick={() => handleEdit(employee)}
                                        className="bg-blue-500 text-white p-2 rounded mr-2"
                                    >
                                        View/Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(employee._id)
                                        }
                                        className="bg-red-500 text-white p-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={11} className="text-center p-2">
                                Không có nhân viên
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Custom Modal */}
            {showModal && editedEmployee && (
                <EmployeeModal
                    isOpen={showModal}
                    employee={editedEmployee}
                    onSave={handleSave}
                    onClose={handleCancel}
                    onChange={handleChange}
                />
            )}

            {/* Register Modal */}
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => {
                    setShowRegisterModal(false);
                    dispatch(getAllEmployees()); // Refresh danh sách sau khi đóng modal
                }}
            />
        </div>
    );
};

export default Employee;
