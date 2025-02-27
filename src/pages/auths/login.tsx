import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormInputs, loginSchema } from "../../zods/auth.schema";
import CustomInput from "../../components/commons/input";
import Button from "../../components/commons/button";

const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormInputs) => {
        console.log("Login data:", data);
        alert("Đăng nhập thành công! ✅");
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">
                Đăng Nhập 🔐
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CustomInput
                    label="Số Điện Thoại"
                    name="phone"
                    register={register}
                    error={errors.phone?.message}
                />
                <CustomInput
                    label="Mật Khẩu"
                    type="password"
                    name="password"
                    register={register}
                    error={errors.password?.message}
                />

                <div className="flex justify-center">
                    <Button type="submit" size="medium" variant="primary">
                        Đăng Nhập
                    </Button>
                </div>
            </form>

            <p className="text-center text-gray-600 mt-4">
                Chưa có tài khoản?{" "}
                <a href="/register" className="text-blue-500">
                    Đăng ký
                </a>
            </p>
        </div>
    );
};

export default Login;
