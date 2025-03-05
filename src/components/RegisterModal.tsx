import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchPositions } from "../redux/reducers/positionReducer";
import { fetchDepartments } from "../redux/reducers/departmentsReducer";
import { RegisterData, registerUser } from "../services/auth/auth.service";
import CustomInput from "./commons/input";
import { Department } from "../models/department";
import { Position } from "../models/position";
import Button from "./commons/button";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const dispatch = useDispatch<AppDispatch>();

    const {
        positions,
        loading: positionsLoading,
        error: positionsError,
    } = useSelector((state: RootState) => state.positions);

    const {
        departments,
        loading: departmentsLoading,
        error: departmentsError,
    } = useSelector((state: RootState) => state.departments);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchPositions());
            dispatch(fetchDepartments());
        }
    }, [isOpen, dispatch]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterData>();

    useEffect(() => {
        if (positions.length > 0) {
            setValue("position", positions[0]._id);
        }
        if (departments.length > 0) {
            setValue("department", departments[0]._id);
        }
    }, [positions, departments, setValue]);

    const onSubmit = async (data: RegisterData) => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const formData: RegisterData = {
                ...data,
                avatar: data.avatar ?? null,
                position:
                    data.position.length === 0
                        ? positions[0]._id
                        : data.position,
                department:
                    data.department.length === 0
                        ? departments[0]._id
                        : data.department,
            };

            await registerUser(formData);
            setSuccess("Đăng ký thành công!");
            onClose(); // Đóng modal sau khi thành công
        } catch (err: any) {
            setError(err.message || "Đăng ký thất bại!");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null; // Không render nếu modal không mở

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-4/5 min-h-[75vh] relative">
                <h2 className="text-2xl font-bold text-center mb-4">
                    Đăng Ký Nhân Sự 📝
                </h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    ✕
                </button>

                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && (
                    <p className="text-green-500 text-center">{success}</p>
                )}

                {positionsLoading || departmentsLoading ? (
                    <p className="text-center">Đang tải dữ liệu...</p>
                ) : positionsError || departmentsError ? (
                    <p className="text-red-500 text-center">
                        {positionsError || departmentsError}
                    </p>
                ) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <CustomInput
                                label="Họ và Tên"
                                name="fullName"
                                register={register}
                                error={errors.fullName?.message}
                            />
                            <CustomInput
                                label="Ngày Sinh"
                                type="date"
                                name="dob"
                                register={register}
                                error={errors.dob?.message}
                            />
                            <div>
                                <label className="font-medium">Giới tính</label>
                                <select
                                    className="p-2 border rounded w-full"
                                    {...register("gender")}
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm">
                                        {errors.gender.message}
                                    </p>
                                )}
                            </div>

                            <CustomInput
                                label="Địa Chỉ"
                                name="address"
                                register={register}
                                error={errors.address?.message}
                            />
                            <CustomInput
                                label="Số Điện Thoại"
                                name="phone"
                                register={register}
                                error={errors.phone?.message}
                            />
                            <div>
                                <label className="font-medium">Phòng Ban</label>
                                <select
                                    className="p-2 border rounded w-full"
                                    {...register("department")}
                                >
                                    {departments.map((dep: Department) => (
                                        <option key={dep._id} value={dep._id}>
                                            {dep.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.department && (
                                    <p className="text-red-500 text-sm">
                                        {errors.department.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="font-medium">Chức Vụ</label>
                                <select
                                    className="p-2 border rounded w-full"
                                    {...register("position")}
                                >
                                    {positions.map((pos: Position) => (
                                        <option key={pos._id} value={pos._id}>
                                            {pos.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.position && (
                                    <p className="text-red-500 text-sm">
                                        {errors.position.message}
                                    </p>
                                )}
                            </div>

                            <CustomInput
                                label="Mức Lương"
                                name="salary"
                                register={register}
                                error={errors.salary?.message}
                            />
                            <CustomInput
                                label="Ngày Bắt Đầu"
                                type="date"
                                name="startDate"
                                register={register}
                                error={errors.startDate?.message}
                            />
                        </div>

                        {/* <div className="flex flex-col items-center">
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Avatar"
                                    className="max-w-96 max-h-96 rounded-full mb-2"
                                />
                            )}
                            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
                                Chọn Ảnh Đại Diện
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        </div> */}

                        <div className="flex justify-center gap-4">
                            <Button
                                type="submit"
                                size="medium"
                                variant="primary"
                                disabled={loading}
                            >
                                {loading ? "Đang xử lý..." : "Đăng Ký"}
                            </Button>
                            <Button
                                type="button"
                                size="medium"
                                variant="secondary"
                                onClick={onClose}
                            >
                                Hủy
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterModal;
