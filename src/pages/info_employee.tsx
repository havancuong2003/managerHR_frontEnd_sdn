import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getEmployeeById,
    updateEmployeeById,
    uploadEmployeeAvatar,
} from "../services/auth/employee.service";

const InfoEmployee = () => {
    const { id } = useParams(); // Lấy ID nhân viên từ URL
    const [employee, setEmployee] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        dob: "",
        gender: "",
        address: "",
        phone: "",
        avatarUrl: "",
    });

    // ✅ Lấy thông tin nhân viên khi component mount
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await getEmployeeById(id || "");
                console.log("check res", response);

                setEmployee(response);
                setFormData({
                    fullName: response.fullName,
                    dob: response.dob,
                    gender: response.gender,
                    address: response.address,
                    phone: response.phone,
                    avatarUrl: response.avatarUrl || "",
                });
            } catch (error) {
                console.error("Lỗi khi lấy thông tin nhân viên:", error);
            }
        };

        if (id) fetchEmployee();
    }, [id]);

    // ✅ Xử lý thay đổi input
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Xử lý upload ảnh
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await uploadEmployeeAvatar(id || "", formData);
            setFormData((prev) => ({
                ...prev,
                avatarUrl: response.data.avatarUrl,
            }));
        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error);
        }
    };

    // ✅ Xử lý tải xuống ảnh
    const handleDownloadImage = () => {
        if (!formData.avatarUrl) return;
        const link = document.createElement("a");
        link.href = formData.avatarUrl;
        link.download = "avatar.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ✅ Xử lý cập nhật thông tin nhân viên
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateEmployeeById(id || "", formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
        }
    };

    if (!employee)
        return <p className="text-center mt-10">Đang tải dữ liệu...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Thông Tin Nhân Viên
            </h2>
            <div className="flex flex-col items-center">
                <img
                    src={formData.avatarUrl || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full border mb-4"
                />
                <div className="flex gap-2">
                    <input
                        type="file"
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
                    <button
                        onClick={handleDownloadImage}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Tải Xuống
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {Object.keys(formData).map(
                        (key) =>
                            key !== "avatarUrl" && (
                                <div key={key}>
                                    <label className="block text-sm font-semibold">
                                        {key}
                                    </label>
                                    <input
                                        type={key === "dob" ? "date" : "text"}
                                        name={key}
                                        value={
                                            formData[
                                                key as keyof typeof formData
                                            ]
                                        }
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                            )
                    )}
                </div>

                <div className="mt-6 flex justify-center">
                    {isEditing ? (
                        <>
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600"
                            >
                                Lưu
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
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
            </form>
        </div>
    );
};

export default InfoEmployee;
