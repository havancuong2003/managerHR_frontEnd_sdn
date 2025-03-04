import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { getAllEmployees } from "../services/commons/employee.service";
import {
    deleteEmployee,
    saveEmployee,
} from "../redux/reducers/employeesReducer";
import { fetchDepartments } from "../redux/reducers/departmentsReducer";

// Modal Component
import EmployeeModal from "../components/EmployeeModal";
import RegisterModal from "../components/RegisterModal";
import { Department } from "../models/department";

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
    const { departments } = useSelector((state: any) => state.departments);

    const [editedEmployee, setEditedEmployee] = useState<EmployeeType | null>(
        null
    );
    const [showModal, setShowModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [minSalary, setMinSalary] = useState<number>(0);
    const [startDateFilter, setStartDateFilter] = useState("");
    const [sortField, setSortField] = useState<keyof EmployeeType>("fullName");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(3);

    useEffect(() => {
        dispatch(getAllEmployees());
        dispatch(fetchDepartments());
    }, [dispatch]);

    useEffect(() => {
        setCurrentPage(1); // Reset trang về 1 khi thay đổi số user per page
    }, [usersPerPage]);
    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(1);
        setSearchTerm(e.target.value);
    };

    const handleDepartmentChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setCurrentPage(1);
        setSelectedDepartment(e.target.value);
    };

    const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(1);
        setMinSalary(parseInt(e.target.value));
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(1);
        setStartDateFilter(e.target.value);
    };
    // Chỉnh sửa thông tin nhân viên
    const handleEdit = (employee: EmployeeType) => {
        setEditedEmployee({ ...employee });
        setShowModal(true);
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentPage(1);
        setSelectedGender(e.target.value);
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

    const filteredEmployees = employees
        .filter(
            (employee: EmployeeType) =>
                employee.fullName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                employee.departmentId.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                employee.positionId.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        )
        .filter(
            (employee: EmployeeType) =>
                !selectedDepartment ||
                employee.departmentId._id === selectedDepartment
        )
        .filter(
            (employee: EmployeeType) =>
                !selectedGender || employee.gender === selectedGender
        )
        .filter(
            (employee: EmployeeType) =>
                !minSalary || employee.base_salary >= minSalary
        )
        .filter(
            (employee: EmployeeType) =>
                !startDateFilter ||
                new Date(employee.startDate) >= new Date(startDateFilter)
        );

    const sortedEmployees = filteredEmployees.sort(
        (a: EmployeeType, b: EmployeeType) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
            return 0;
        }
    );

    const totalPages = Math.max(
        1,
        Math.ceil(filteredEmployees.length / usersPerPage)
    );

    // Lọc danh sách theo trang
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = sortedEmployees.slice(
        indexOfFirstUser,
        indexOfLastUser
    );

    return (
        <div className="bg-gray-100 p-2">
            <h2 className="text-2xl font-bold mb-4">Danh Sách Nhân Viên</h2>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-wrap gap-2">
                    {/* Ô tìm kiếm */}
                    <div className="flex flex-col flex-1 min-w-[200px]">
                        <label className="text-xs text-gray-600 mb-1">
                            🔍 Tìm kiếm
                        </label>
                        <div className="flex items-center border border-gray-300 p-2 rounded-md text-sm">
                            <input
                                type="text"
                                placeholder="Nhập tên, phòng ban, chức vụ..."
                                value={searchTerm}
                                onChange={handleSearchTermChange}
                                className="w-full outline-none"
                            />
                        </div>
                    </div>

                    {/* Phòng ban */}
                    <div className="flex flex-col min-w-[160px]">
                        <label className="text-xs text-gray-600 mb-1">
                            🏢 Phòng ban
                        </label>
                        <div className="flex items-center border border-gray-300 p-2 rounded-md text-sm">
                            <select
                                value={selectedDepartment}
                                onChange={(e) =>
                                    setSelectedDepartment(e.target.value)
                                }
                                className="w-full outline-none bg-transparent"
                            >
                                <option value="">Chọn phòng ban</option>
                                {departments.map((department: Department) => (
                                    <option
                                        key={department._id}
                                        value={department._id}
                                    >
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Giới tính */}
                    <div className="flex flex-col min-w-[120px]">
                        <label className="text-xs text-gray-600 mb-1">
                            ⚧ Giới tính
                        </label>
                        <div className="flex items-center border border-gray-300 p-2 rounded-md text-sm">
                            <select
                                value={selectedGender}
                                onChange={handleGenderChange}
                                className="w-full outline-none bg-transparent"
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                    </div>

                    {/* Mức lương tối thiểu */}
                    <div className="flex flex-col min-w-[140px]">
                        <label className="text-xs text-gray-600 mb-1">
                            💰 Mức lương tối thiểu
                        </label>
                        <div className="flex items-center border border-gray-300 p-2 rounded-md text-sm">
                            <input
                                type="number"
                                placeholder="Nhập lương"
                                value={minSalary}
                                onChange={handleMinSalaryChange}
                                className="w-full outline-none"
                            />
                        </div>
                    </div>

                    {/* Ngày làm việc */}
                    <div className="flex flex-col min-w-[160px]">
                        <label className="text-xs text-gray-600 mb-1">
                            📆 Ngày làm việc
                        </label>
                        <div className="flex items-center border border-gray-300 p-2 rounded-md text-sm">
                            <input
                                type="date"
                                value={startDateFilter}
                                onChange={handleStartDateChange}
                                className="w-full outline-none"
                            />
                        </div>
                    </div>

                    {/* Sắp xếp theo */}
                    <div className="flex flex-col min-w-[140px]">
                        <label className="text-xs text-gray-600 mb-1">
                            🔀 Sắp xếp theo
                        </label>
                        <div className="flex items-center border border-gray-300 p-2 rounded-md text-sm">
                            <select
                                value={sortField}
                                onChange={handleDepartmentChange}
                                className="w-full outline-none bg-transparent"
                            >
                                <option value="">Chọn tiêu chí sắp xếp</option>
                                <option value="fullName">Tên</option>
                                <option value="dob">Ngày Sinh</option>
                                <option value="base_salary">Lương</option>
                                <option value="startDate">Ngày Làm</option>
                            </select>
                        </div>
                    </div>

                    {/* Thứ tự sắp xếp */}
                    <div className="flex flex-col min-w-[120px]">
                        <label className="text-xs text-gray-600 mb-1">
                            ⬆⬇ Thứ tự
                        </label>
                        <div className="flex items-center border border-gray-300 p-2 rounded-md text-sm">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full outline-none bg-transparent"
                            >
                                <option value="asc">Tăng dần</option>
                                <option value="desc">Giảm dần</option>
                            </select>
                        </div>
                    </div>

                    {/* Nút thêm nhân viên */}
                    <div className="flex flex-col min-w-[160px]">
                        <label className="text-xs text-white mb-1">⠀</label>{" "}
                        {/* Ẩn label để căn chỉnh hàng */}
                        <button
                            onClick={() => setShowRegisterModal(true)}
                            className="bg-green-500 text-white p-2 rounded text-sm w-full"
                        >
                            ➕ Thêm Nhân Viên
                        </button>
                    </div>
                </div>
            </div>

            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="w-full h-[500px] overflow-auto border border-gray-300 rounded-lg">
                <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0">
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
                        {currentUsers.length > 0 ? (
                            currentUsers.map((employee: EmployeeType) => (
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
                                    <td className="border-b p-2">
                                        {employee.dob}
                                    </td>
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
            </div>

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
            {/* Phân trang */}
            <div className="flex justify-center items-center mt-4 gap-4">
                <label className="text-sm">Số nhân viên mỗi trang:</label>
                <input
                    type="number"
                    className="border p-2 rounded w-20"
                    value={usersPerPage}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value > 0) {
                            setUsersPerPage(value);
                        }
                    }}
                    onBlur={(e) => {
                        if (
                            Number(e.target.value) <= 0 ||
                            e.target.value === ""
                        ) {
                            setUsersPerPage(1); // Nếu nhập <=0 hoặc rỗng thì tự động về 1
                        }
                    }}
                />

                <button
                    className={`p-2 border rounded ${
                        currentPage === 1 && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                >
                    ⬅
                </button>
                <span>
                    Trang {currentPage} / {totalPages}
                </span>
                <button
                    className={`p-2 border rounded ${
                        currentPage === totalPages &&
                        "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    ➡
                </button>
            </div>
            {/* Register Modal */}
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => {
                    setShowRegisterModal(false);
                    dispatch(getAllEmployees());
                }}
            />
            <div className="flex justify-center mt-6 gap-4">
                {/* Nút Xuất Excel */}
                <button className="bg-blue-500 text-white p-3 rounded text-sm">
                    📤 Sao lưu dữ liệu nhân viên (Excel)
                </button>

                {/* Nút Nhập Excel */}
                <button className="bg-green-500 text-white p-3 rounded text-sm">
                    📥 Phục hồi dữ liệu nhân viên (Excel)
                </button>
            </div>
        </div>
    );
};

export default Employee;
