import React from "react";

interface ModalProps {
    isOpen: boolean;
    employee: any;
    onSave: () => void;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
}

const EmployeeModal: React.FC<ModalProps> = ({
    isOpen,
    employee,
    onSave,
    onClose,
    onChange,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-3/4 max-w-6xl">
                <h2 className="text-2xl font-bold mb-4">
                    Chỉnh sửa thông tin nhân viên
                </h2>

                <div className="grid grid-cols-2 gap-6">
                    <div className="">
                        <div className="flex flex-col items-center">
                            <img
                                src={employee.avatarUrl}
                                alt={employee.fullName}
                                className="w-56 h-56 rounded-full mb-4"
                            />
                            <label className="block text-center">
                                Ảnh Đại Diện
                            </label>
                        </div>
                        <div>
                            <div className="mb-4">
                                <label className="block">Tên Nhân Viên</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={employee.fullName}
                                    onChange={(e) => onChange(e, "fullName")}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block">Ngày Sinh</label>
                                <input
                                    type="text"
                                    name="dob"
                                    value={employee.dob}
                                    onChange={(e) => onChange(e, "dob")}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block">Giới Tính</label>
                                <input
                                    type="text"
                                    name="gender"
                                    value={employee.gender}
                                    onChange={(e) => onChange(e, "gender")}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Các input thông tin nhân viên (Chiếm 3 phần còn lại) */}
                    <div>
                        <div className="mb-4">
                            <label className="block">Địa Chỉ</label>
                            <input
                                type="text"
                                name="address"
                                value={employee.address}
                                onChange={(e) => onChange(e, "address")}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Số Điện Thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={employee.phone}
                                onChange={(e) => onChange(e, "phone")}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Phòng Ban</label>
                            <input
                                type="text"
                                name="department"
                                value={employee.departmentId?.name}
                                onChange={(e) => onChange(e, "department")}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Chức Vụ</label>
                            <input
                                type="text"
                                name="position"
                                value={employee.positionId?.name}
                                onChange={(e) => onChange(e, "position")}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Mức Lương</label>
                            <input
                                type="number"
                                name="base_salary"
                                value={employee.base_salary}
                                onChange={(e) => onChange(e, "base_salary")}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Ngày Bắt Đầu</label>
                            <input
                                type="text"
                                name="startDate"
                                value={employee.startDate}
                                onChange={(e) => onChange(e, "startDate")}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={onSave}
                        className="bg-green-500 text-white p-2 rounded mr-2"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white p-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;
