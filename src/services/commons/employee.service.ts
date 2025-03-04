import {
    setEmployees,
    setError,
    setLoading,
} from "../../redux/reducers/employeesReducer";
import { AppDispatch } from "../../redux/store";
import axiosInstance from "../axios-config";

export const getAllEmployees = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get("/employees"); // Cập nhật URL API thực tế của bạn
        dispatch(setEmployees(response.data));
    } catch (error) {
        dispatch(setError("Lỗi khi tải dữ liệu nhân viên"));
    } finally {
        dispatch(setLoading(false));
    }
};
