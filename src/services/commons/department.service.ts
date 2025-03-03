import axiosInstance from "../axios-config";

export const getAllDepartments = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get("/departments");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Lỗi không xác định";
    }
};
