import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
    getEmployeeById,
    updateEmployeeById,
} from "../services/auth/employee.service";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { clearAuth } from "../redux/reducers/authReducer";
import { toast, ToastContainer } from "react-toastify";

const InfoEmployee = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    // get id of current user from redux
    const currentUserId = useSelector((state: RootState) => state.auth.userId);
    if (!currentUserId) {
        // call logout
        dispatch(clearAuth());
        window.location.href = "/managerHR/login";
    }
    if (id !== currentUserId) {
        return <Navigate to="/forbidden" />;
    }
    const [employee, setEmployee] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        dob: "",
        gender: "",
        address: "",
        phone: "",
        avatarUrl: "",
        department: "",
        position: "",
        salary: 0,
        startDate: "",
        role: "",
        avatar: null as File | null, // Thêm kiểu dữ liệu cho avatar
    });
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null); // Preview ảnh

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await getEmployeeById(id || "");
                setEmployee(response);
                setFormData({
                    fullName: response.fullName,
                    dob: response.dob,
                    gender: response.gender,
                    address: response.address,
                    phone: response.phone,
                    avatarUrl: response.avatarUrl || "",
                    department: response.departmentId.name,
                    position: response.positionId.name,
                    salary: response.base_salary,
                    startDate: response.startDate,
                    role: response.role,
                    avatar: null, // Không lưu avatar cũ ở đây, vì sẽ dùng `avatarUrl` khi cần
                });
            } catch (error) {
                console.error("Lỗi khi lấy thông tin nhân viên:", error);
            }
        };

        if (id) fetchEmployee();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPreviewAvatar(URL.createObjectURL(file)); // Preview ảnh mới
            setFormData({
                ...formData,
                avatar: file, // Lưu avatar mới trong state
            });
        }
    };

    const handleSubmit = async () => {
        if (!employee) return;
        // Validate các trường đã thay đổi trong formData so với originalEmployee
        const validationError = validateChangedFields(employee, formData);
        if (validationError) {
            // Nếu có lỗi validate, thông báo lỗi và không tiếp tục
            toast.error(validationError, {
                autoClose: false,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        try {
            const formDataToSubmit = { ...formData };

            // Nếu có avatar mới, sẽ gửi lại cùng các dữ liệu khác
            if (formData.avatar && formData.avatar instanceof File) {
                const response = await updateEmployeeById(
                    id || "",
                    formDataToSubmit
                );
                setEmployee(response);
                setPreviewAvatar(null);
                setFormData({
                    ...formData,
                    avatar: null,
                    avatarUrl: response.avatarUrl,
                    // Reset avatar
                });
                toast.success("Cập nhật thành công", {
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                // Nếu không có thay đổi ảnh, chỉ gửi các thông tin khác
                const response = await updateEmployeeById(
                    id || "",
                    formDataToSubmit
                );
                setEmployee(response);
                setPreviewAvatar(null);
                setFormData({
                    ...formData,
                    avatar: null,
                    avatarUrl: response.avatarUrl,
                    // Reset avatar
                });
                toast.success("Cập nhật thành công", {
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật nhân viên:", error);
        }
    };

    const handleCancel = () => {
        setPreviewAvatar(null);
        // Nếu bấm hủy thì quay lại dữ liệu ban đầu
        setFormData({
            fullName: employee?.fullName || "",
            dob: employee?.dob || "",
            gender: employee?.gender || "",
            address: employee?.address || "",
            phone: employee?.phone || "",
            avatarUrl: employee?.avatarUrl || "",
            department: employee?.departmentId?.name || "",
            position: employee?.positionId?.name || "",
            salary: employee?.base_salary || 0,
            startDate: employee?.startDate || "",
            role: employee?.role || "",
            avatar: null, // Reset avatar
        });
        setIsEditing(false);
    };
    const toDataURL = async (url: string) => {
        /* Using Axios */
        const response = await axios.get(url, { responseType: "blob" });
        const imageDataUrl = URL.createObjectURL(response.data);

        return imageDataUrl;
    };
    const handleDownloadAvatar = async () => {
        if (previewAvatar) {
            fetch(previewAvatar) // Lấy Blob từ URL
                .then((res) => res.blob())
                .then((blob) => {
                    const link = document.createElement("a");
                    const url = URL.createObjectURL(blob); // Tạo một URL từ Blob
                    link.href = url;
                    link.download = "avatar.png"; // Đặt tên file cho ảnh tải xuống
                    link.click();
                    URL.revokeObjectURL(url); // Giải phóng URL đã tạo
                })
                .catch((err) => console.error("Error downloading Blob", err));
        } else {
            const a = document.createElement("a");
            a.href = await toDataURL(formData.avatarUrl);
            a.download = "myImage.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    if (!employee)
        return <p className="text-center mt-10">Đang tải dữ liệu...</p>;

    const validateChangedFields = (originalEmployee: any, formData: any) => {
        // Kiểm tra fullName nếu thay đổi
        if (formData.fullName !== originalEmployee.fullName) {
            if (!formData.fullName || formData.fullName.trim().length < 3) {
                return "Tên nhân viên phải có ít nhất 3 ký tự";
            }
        }

        // Kiểm tra dob (Ngày sinh) nếu thay đổi
        if (formData.dob !== originalEmployee.dob) {
            if (!formData.dob || new Date(formData.dob) >= new Date()) {
                return "Ngày sinh phải ở trong quá khứ";
            }
        }

        // Kiểm tra gender (Giới tính) nếu thay đổi
        if (formData.gender !== originalEmployee.gender) {
            if (!formData.gender || !["Nam", "Nữ"].includes(formData.gender)) {
                return "Giới tính chỉ có thể là Nam hoặc Nữ";
            }
        }

        // Kiểm tra address (Địa chỉ) nếu thay đổi
        if (formData.address !== originalEmployee.address) {
            if (!formData.address || formData.address.trim().length < 5) {
                return "Địa chỉ phải có ít nhất 5 ký tự";
            }
        }

        // Kiểm tra phone (Số điện thoại) nếu thay đổi
        if (formData.phone !== originalEmployee.phone) {
            if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
                return "Số điện thoại phải có 10 chữ số";
            }
        }

        return null; // Nếu tất cả các trường hợp validate đều hợp lệ
    };

    return (
        <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 h-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Thông Tin Nhân Viên
            </h2>

            <div className="grid grid-cols-3 gap-6">
                {/* Cột ảnh */}
                <div className="flex flex-col items-center">
                    <div
                        className="w-[400px] h-[400px] rounded-full border mb-4"
                        style={{
                            backgroundImage: `url(${
                                previewAvatar ||
                                (formData.avatarUrl &&
                                formData.avatarUrl.trim() !== ""
                                    ? formData.avatarUrl
                                    : "/img/default_avatar.jpg")
                            })`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></div>

                    <div className="flex gap-3">
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/gif, image/jpg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                                >
                                    Chọn Ảnh
                                </label>
                            </>
                        )}
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded"
                            onClick={handleDownloadAvatar}
                        >
                            Tải Xuống
                        </button>
                    </div>
                </div>

                {/* Cột thông tin */}
                <div className="col-span-2">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {Object.keys(formData)
                            .filter(
                                (key) =>
                                    key !== "avatarUrl" &&
                                    key !== "role" &&
                                    key !== "avatar" // Thêm avatar vào danh sách loại trừ
                            )
                            .map((key) => (
                                <div key={key}>
                                    <label className="block text-sm font-semibold capitalize">
                                        {key === "fullName"
                                            ? "Tên nhân viên"
                                            : key === "dob"
                                            ? "Ngày sinh"
                                            : key === "gender"
                                            ? "Giới tính"
                                            : key === "address"
                                            ? "Địa chỉ"
                                            : key === "phone"
                                            ? "Số điện thoại"
                                            : key === "department"
                                            ? "Phòng ban"
                                            : key === "position"
                                            ? "Chức vụ"
                                            : key === "salary"
                                            ? "Lương"
                                            : key === "startDate"
                                            ? "Ngày bắt đầu"
                                            : key}
                                    </label>
                                    {isEditing &&
                                    [
                                        "fullName",
                                        "dob",
                                        "gender",
                                        "address",
                                        "phone",
                                    ].includes(key) ? (
                                        <input
                                            type={
                                                key === "dob" ? "date" : "text"
                                            }
                                            name={key}
                                            value={String(
                                                formData[
                                                    key as keyof typeof formData
                                                ]
                                            )}
                                            onChange={handleChange}
                                            className="border p-4 rounded w-full"
                                        />
                                    ) : (
                                        <span
                                            className={`block p-4 rounded w-full ${
                                                [
                                                    "department",
                                                    "position",
                                                    "salary",
                                                    "startDate",
                                                ].includes(key)
                                                    ? "bg-gray-200 text-gray-700 font-semibold"
                                                    : "bg-gray-100"
                                            }`}
                                        >
                                            {String(
                                                formData[
                                                    key as keyof typeof formData
                                                ]
                                            )}
                                        </span>
                                    )}
                                </div>
                            ))}
                    </div>

                    <div className="mt-6 flex justify-center">
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600"
                                >
                                    Lưu
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                                >
                                    Hủy
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                Chỉnh sửa
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoEmployee;
