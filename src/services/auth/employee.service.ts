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
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("dob", data.dob);
        formData.append("gender", data.gender);
        formData.append("address", data.address);
        formData.append("phone", data.phone);
        // file
        if (data.avatar && data.avatar instanceof File) {
            formData.append("avatar", data.avatar);
        }
        const response = await axiosInstance.post(
            `/employees/${id}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.log("error update employee by id", error);
        throw error;
    }
};

export const backUpEmployee = async () => {
    try {
        const response = await axiosInstance.get("/employees/backupEmployee", {
            responseType: "blob",
            withCredentials: true,
        });

        return response;
    } catch (error) {
        console.log("error backup employee", error);
        throw error;
    }
};

export const restoreEmployee = async (file: any) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post(
            "/employees/restoreEmployee",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            }
        );

        return response.data;
        return "a";
    } catch (error) {
        console.log("error restore employee", error);
        throw error;
    }
};

export const adminEditInfoEmployee = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.post(
            `/employees/admin/${id}`,
            data,
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.log("error update employee by id", error);
        throw error;
    }
};
