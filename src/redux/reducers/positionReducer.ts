import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAllPositions } from "../../services/commons/position.service"; // Gọi API từ service

// Định nghĩa kiểu dữ liệu Position
interface Position {
    _id: string;
    name: string;
    description: string;
}

interface PositionState {
    positions: Position[];
    loading: boolean;
    error: string | null;
}

// Khởi tạo state ban đầu
const initialState: PositionState = {
    positions: [],
    loading: false,
    error: null,
};

// Thunk để fetch positions từ API
export const fetchPositions = createAsyncThunk(
    "positions/fetchPositions",
    async () => {
        const response = await getAllPositions(); // Gọi API để lấy positions
        return response; // Trả về dữ liệu nhận được từ API
    }
);

// Tạo slice cho positions
const positionsSlice = createSlice({
    name: "positions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPositions.pending, (state) => {
                state.loading = true; // Khi bắt đầu fetch, loading = true
            })
            .addCase(fetchPositions.fulfilled, (state, action) => {
                state.loading = false; // Khi fetch thành công, loading = false
                state.positions = action.payload; // Lưu dữ liệu vào positions
            })
            .addCase(fetchPositions.rejected, (state, action) => {
                state.loading = false; // Khi fetch lỗi, loading = false
                state.error = action.error.message || "Có lỗi xảy ra"; // Lưu thông báo lỗi
            });
    },
});

export default positionsSlice.reducer;
