import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    accessToken: string | null;
    userId: string | null;
    role: string | null;
}

const initialState: AuthState = {
    accessToken: localStorage.getItem("accessToken"), // ✅ Lấy từ localStorage
    userId: localStorage.getItem("userId"), // ✅ Lấy từ localStorage
    role: localStorage.getItem("role"), // ✅ Lấy từ localStorage
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData: (
            state,
            action: PayloadAction<{
                accessToken: string;
                userId: string;
                role: string;
            }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.userId = action.payload.userId;
            state.role = action.payload.role;

            // ✅ Lưu vào localStorage
            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("userId", action.payload.userId);
            localStorage.setItem("role", action.payload.role);
        },
        clearAuth: (state) => {
            state.accessToken = null;
            state.userId = null;
            state.role = null;

            // ✅ Xóa khỏi localStorage khi logout
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
        },
    },
});

export const { setAuthData, clearAuth } = authSlice.actions;
export default authSlice.reducer;
