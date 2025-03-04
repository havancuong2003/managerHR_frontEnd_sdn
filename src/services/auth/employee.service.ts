import axiosInstance from "../axios-config";

export const getEmployeeById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/employees/${id}`);

        return response.data;
    } catch (error) {
        console.log("error get employee by id", error);
        throw error;
    }
};

export const updateEmployeeById = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/employees/${id}`, data);

        return response.data;
    } catch (error) {
        console.log("error update employee by id", error);
        throw error;
    }
};

export const uploadEmployeeAvatar = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(
            `/employees/${id}/avatar`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.log("error update employee by id", error);
        throw error;
    }
};
