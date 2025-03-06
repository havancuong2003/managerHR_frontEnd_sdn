import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormInputs, loginSchema } from "../../zods/auth.schema";
import CustomInput from "../../components/commons/input";
import Button from "../../components/commons/button";
import { loginUser } from "../../services/auth/auth.service"; // Đảm bảo bạn đã có hàm loginUser
import { useNavigate } from "react-router-dom"; // Dùng để chuyển hướng sau khi đăng nhập thành công
import { useDispatch } from "react-redux";
import { setAuthData } from "../../redux/reducers/authReducer";
import { toast, ToastContainer } from "react-toastify";

const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate(); // Dùng để chuyển hướng sau khi đăng nhập thành công
    const dispatch = useDispatch();

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await loginUser(data);
            console.log("dấdsadasd", response);

            dispatch(
                setAuthData({
                    accessToken: response.accessToken,
                    userId: response.userId,
                    role: response.role,
                })
            );
            navigate("/dashboard");
        } catch (error) {
            console.error("Lỗi khi đăng nhậpaaaa:", error);
            toast.error("Lỗi khi đăng nhập!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">
                Đăng Nhập 🔐
            </h2>
            <div className="space-y-4">
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
                    <Button
                        type="button"
                        size="medium"
                        variant="primary"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Đăng Nhập
                    </Button>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default Login;
