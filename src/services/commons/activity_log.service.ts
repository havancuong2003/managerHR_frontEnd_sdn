import axiosInstance from "../axios-config";

export const getActivityLogs = async () => {
    try {
        const response = await axiosInstance.get("/activity_logs");
        console.log("check ress", response);

        return response.data;
    } catch (error) {}
};

export const downloadActivityLogs = async (data: any) => {
    try {
        const response = await axiosInstance.post(
            "/activity_logs/download",
            {
                data,
            },
            {
                responseType: "blob", // Ensure the response is a Blob (binary data)
                withCredentials: true,
            }
        );

        return response; // The response contains the Blob
    } catch (error) {
        console.error(error);
    }
};
