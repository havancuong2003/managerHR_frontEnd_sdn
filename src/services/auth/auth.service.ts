import axiosInstance from "../axios-config";

export interface RegisterData {
    fullName: string;
    dob: string;
    gender: "Nam" | "Nữ";
    address: string;
    phone: string;
    department: string;
    position: string;
    salary: number;
    startDate: string;
    avatar?: File | null;
}

export interface LoginData {
    phone: string;
    password: string;
}

export const registerUser = async (data: RegisterData): Promise<any> => {
    try {
        const formData = new FormData();

        // ✅ Đảm bảo dữ liệu được gửi đúng kiểu
        formData.append("fullName", data.fullName);
        formData.append("dob", data.dob);
        formData.append("gender", data.gender);
        formData.append("address", data.address);
        formData.append("phone", data.phone);
        formData.append("department", data.department);
        formData.append("position", data.position);
        formData.append("base_salary", data.salary.toString()); // Chuyển number -> string
        formData.append("startDate", data.startDate);

        // Nếu có avatar, thêm vào formData
        if (data.avatar && data.avatar instanceof File) {
            formData.append("avatar", data.avatar);
        }
        const response = await axiosInstance.post("/auth/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Lỗi không xác định";
    }
};

export const loginUser = async (data: LoginData): Promise<any> => {
    try {
        // Gửi yêu cầu POST đến API đăng nhập
        const response = await axiosInstance.post("/auth/login", data);

        // Trả về kết quả từ API (response.data có thể chứa thông tin như token, user, ... tùy theo API của bạn)
        return response.data;
    } catch (error: any) {
        // Nếu có lỗi, ném lỗi từ phản hồi của server hoặc lỗi không xác định
        throw error.response?.data || "Lỗi không xác định khi đăng nhập";
    }
};

export const logoutUser = async (): Promise<any> => {
    try {
        const response = await axiosInstance.post(
            "/auth/logout",
            {},
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Lỗi không xác định khi đăng xuat";
    }
};
