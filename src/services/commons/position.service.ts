import axiosInstance from "../axios-config";

export const getAllPositions = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get("/positions");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Lỗi không xác định";
    }
};
