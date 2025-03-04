import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    accessToken: string | null;
    userId: string | null; // ✅ Thêm userId vào Redux
    role: string | null;
}

const initialState: AuthState = {
    accessToken: null,
    userId: null, // ✅ Ban đầu là null
    role: null,
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
            state.userId = action.payload.userId; // ✅ Lưu userId
            state.role = action.payload.role;
        },
        clearAuth: (state) => {
            state.accessToken = null;
            state.userId = null; // ✅ Xóa userId khi logout
            state.role = null;
        },
    },
});

export const { setAuthData, clearAuth } = authSlice.actions;
export default authSlice.reducer;
