import { z } from "zod";

const registerSchema = z.object({
    fullName: z.string().min(3, "Tên ít nhất 3 ký tự"),
    dob: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), "Ngày sinh không hợp lệ"),
    gender: z.enum(["Nam", "Nữ"]),
    address: z.string().min(5, "Địa chỉ ít nhất 5 ký tự"),
    phone: z.string().regex(/^\d{10}$/, "Số điện thoại phải có 10 số"),
    department: z.string().min(1, "Chọn phòng ban"),
    position: z.string().min(1, "Chọn chức vụ"),
    salary: z.number().min(3000000, "Lương tối thiểu 3 triệu"),
    startDate: z
        .string()
        .refine(
            (date) => !isNaN(Date.parse(date)),
            "Ngày bắt đầu không hợp lệ"
        ),
    avatar: z.instanceof(File).optional(),
});
export type RegisterFormInputs = z.infer<typeof registerSchema>;

const loginSchema = z.object({
    phone: z.string().regex(/^\d{10}$/, "Số điện thoại phải có 10 số"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});
export type LoginFormInputs = z.infer<typeof loginSchema>;

export { loginSchema, registerSchema };
