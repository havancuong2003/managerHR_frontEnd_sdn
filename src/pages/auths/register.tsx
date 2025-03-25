import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterData, registerUser } from "../../services/auth/auth.service";
import CustomInput from "../../components/commons/input";
import Button from "../../components/commons/button";
import { Position } from "../../models/position";
import { Department } from "../../models/department";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchPositions } from "../../redux/reducers/positionReducer";
import { fetchDepartments } from "../../redux/reducers/departmentsReducer";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const dispatch = useDispatch<AppDispatch>();

    // Lấy dữ liệu positions và departments từ Redux
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

    // Fetch positions và departments khi component render lần đầu
    useEffect(() => {
        dispatch(fetchPositions());
        dispatch(fetchDepartments());
    }, [dispatch]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterData>();

    // Set default values for position and department when data is available
    useEffect(() => {
        if (positions.length > 0) {
            setValue("position", positions[0]._id); // Set default position
        }
        if (departments.length > 0) {
            setValue("department", departments[0]._id); // Set default department
        }
    }, [positions, departments, setValue]);

    const onSubmit = async (data: RegisterData) => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const formData: RegisterData = {
                ...data,
                avatar: data.avatar ?? null, // Nếu không có ảnh đại diện, set null
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
        } catch (err: any) {
            setError(err.message || "Đăng ký thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue("avatar", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">
                Đăng Ký Nhân Sự 📝
            </h2>
            <Link to="/dashboard" className="text-blue-500 hover:text-blue-700">
                Quay Lại Trang Chủ
            </Link>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}

            {/* Hiển thị trạng thái loading cho positions và departments */}
            {positionsLoading || departmentsLoading ? (
                <p className="text-center">Đang tải dữ liệu...</p>
            ) : positionsError || departmentsError ? (
                <p className="text-red-500 text-center">
                    {positionsError || departmentsError}
                </p>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Grid 3 cột */}
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

                    {/* Avatar */}
                    <div className="flex flex-col items-center">
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
                    </div>

                    {/* Nút đăng ký căn giữa */}
                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            size="medium"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Đăng Ký"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Register;
