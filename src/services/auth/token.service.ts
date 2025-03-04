import { setAuthData } from "../../redux/reducers/authReducer";
import store from "../../redux/store";
import axiosInstance from "../axios-config";

interface RefreshTokenResponse {
    accessToken: string;
    role: string;
    userId: string;
}

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
    try {
        const response = await axiosInstance.post(
            "/auth/refresh-token",
            {},
            { withCredentials: true }
        );

        store.dispatch(
            setAuthData({
                accessToken: response.data.accessToken,
                role: response.data.role,
                userId: response.data.userId,
            })
        );

        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Lỗi refresh token";
    }
};
