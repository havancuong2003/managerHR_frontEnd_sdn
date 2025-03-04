import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import store from "../redux/store";
import { clearAuth, setAuthData } from "../redux/reducers/authReducer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // ✅ Sử dụng Cookie để gửi Access Token
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

// ✅ KHÔNG cần thêm `Authorization` header vì Access Token có trong Cookie
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config; // ✅ Gửi Access Token bằng Cookie (withCredentials: true)
    },
    (error) => Promise.reject(error)
);

// ✅ Xử lý khi Access Token hết hạn (401 Unauthorized)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig;
        console.log("check error", error);

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
            }

            isRefreshing = true;

            try {
                // ✅ Lấy userId từ Redux
                const userId = store.getState().auth.userId;

                if (!userId)
                    throw new Error("User ID không tồn tại trong Redux");

                // ✅ Gọi API `/refresh-token` (KHÔNG cần headers Authorization)
                await axiosInstance.post("/auth/refresh-token", { userId });

                processQueue(null);
                isRefreshing = false;

                // ✅ Thử lại request gốc mà KHÔNG cần sửa headers
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                isRefreshing = false;
                console.log("check refresh error", refreshError);

                store.dispatch(clearAuth());
                window.location.href = "/managerHR/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
