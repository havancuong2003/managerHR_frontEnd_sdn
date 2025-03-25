import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAllDepartments } from "../../services/commons/department.service"; // Gọi API để lấy danh sách departments

interface Department {
    _id: string;
    name: string;
    description: string;
}

interface DepartmentState {
    departments: Department[];
    loading: boolean;
    error: string | null;
}

// Khởi tạo state ban đầu
const initialState: DepartmentState = {
    departments: [],
    loading: false,
    error: null,
};

// Thunk để fetch departments từ API
export const fetchDepartments = createAsyncThunk(
    "departments/fetchDepartments",
    async () => {
        const response = await getAllDepartments(); // Gọi API để lấy departments
        return response; // Trả về dữ liệu
    }
);

// Tạo slice cho departments
const departmentSlice = createSlice({
    name: "departments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true; // Khi bắt đầu fetch, loading = true
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false; // Khi fetch thành công, loading = false
                state.departments = action.payload; // Lưu departments vào state
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false; // Khi fetch thất bại, loading = false
                state.error = action.error.message || "Có lỗi xảy ra"; // Lưu thông báo lỗi vào state
            });
    },
});

export default departmentSlice.reducer;
