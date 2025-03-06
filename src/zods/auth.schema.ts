import { z } from "zod";

const isPastDate = (date: string) => {
    return new Date(date) < new Date();
};
const registerSchema = z.object({
    fullName: z.string().min(3, "Tên ít nhất 3 ký tự"),
    dob: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), "Ngày sinh không hợp lệ")
        .refine(isPastDate, "Ngày sinh phải ở trong quá khứ"),
    gender: z.enum(["Nam", "Nữ"]),
    address: z.string().min(5, "Địa chỉ ít nhất 5 ký tự"),
    phone: z.string().regex(/^\d{10}$/, "Số điện thoại phải có 10 số"),
    department: z.string().min(1, "Chọn phòng ban"),
    position: z.string().min(1, "Chọn chức vụ"),
    salary: z.string().min(1, "Lương không được bỏ trống"), // Đổi thành string
    startDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), "Ngày bắt đầu không hợp lệ")
        .refine(
            (date) => new Date(date) > new Date(),
            "Ngày bắt đầu phải ở trong tương lai"
        ), // Sửa thành ngày trong tương lai
    avatar: z.instanceof(File).optional(),
});

export type RegisterFormInputs = z.infer<typeof registerSchema>;

const loginSchema = z.object({
    phone: z.string().regex(/^\d{10}$/, "Số điện thoại phải có 10 số"),
    password: z.string().min(3, "Mật khẩu ít nhất 3 ký tự"),
});
export type LoginFormInputs = z.infer<typeof loginSchema>;

export { loginSchema, registerSchema };
