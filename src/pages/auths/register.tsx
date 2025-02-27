import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormInputs, registerSchema } from "../../zods/auth.schema";
import CustomInput from "../../components/commons/input";
import Button from "../../components/commons/button";

const departments = ["Kế toán", "Hành chính", "Kinh doanh", "IT"];
const positions = ["Nhân viên", "Trưởng phòng", "Giám đốc"];

const Register: React.FC = () => {
    const [preview, setPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormInputs) => {
        console.log("Form data:", data);
        alert("Đăng ký thành công! 🎉");
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
                            {departments.map((dep) => (
                                <option key={dep} value={dep}>
                                    {dep}
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
                            {positions.map((pos) => (
                                <option key={pos} value={pos}>
                                    {pos}
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
                        type="number"
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
                            className="w-96 h-96 rounded-full mb-2"
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
                    <Button type="submit" size="medium" variant="primary">
                        Đăng Ký
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Register;
