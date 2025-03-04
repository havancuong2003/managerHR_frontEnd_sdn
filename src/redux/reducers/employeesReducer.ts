import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu dữ liệu nhân viên
interface Employee {
    _id: string;
    fullName: string;
    dob: string;
    gender: string;
    address: string;
    phone: string;
    departmentId: {
        _id: string;
        name: string;
    };
    positionId: {
        _id: string;
        name: string;
    };
    base_salary: number;
    startDate: string;
    avatarUrl: string;
    roleId: {
        _id: string;
        name: string;
    };
}

interface EmployeesState {
    employees: Employee[];
    loading: boolean;
    error: string | null;
    editingEmployee: Employee | null;
}

const initialState: EmployeesState = {
    employees: [],
    loading: false,
    error: null,
    editingEmployee: null,
};

const employeesSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {
        setEmployees: (state, action: PayloadAction<Employee[]>) => {
            state.employees = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setEditingEmployee: (state, action: PayloadAction<Employee | null>) => {
            state.editingEmployee = action.payload;
        },
        saveEmployee: (state, action: PayloadAction<Employee>) => {
            const updatedEmployees = state.employees.map((employee) =>
                employee._id === action.payload._id ? action.payload : employee
            );
            state.employees = updatedEmployees;
            state.editingEmployee = null;
        },
        deleteEmployee: (state, action: PayloadAction<string>) => {
            state.employees = state.employees.filter(
                (employee) => employee._id !== action.payload
            );
        },
    },
});

export const {
    setEmployees,
    setLoading,
    setError,
    setEditingEmployee,
    saveEmployee,
    deleteEmployee,
} = employeesSlice.actions;

export default employeesSlice.reducer;
