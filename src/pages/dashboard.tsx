import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchPositions } from "../redux/reducers/positionReducer";
import { fetchDepartments } from "../redux/reducers/departmentsReducer";

const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Lấy dữ liệu positions và departments từ Redux

    // Fetch positions và departments khi component render lần đầu
    // useEffect(() => {
    //     if (!positions || positions.length === 0) {
    //         dispatch(fetchPositions()); // Fetch positions nếu chưa có dữ liệu
    //     }
    //     if (!departments || departments.length === 0) {
    //         dispatch(fetchDepartments()); // Fetch departments nếu chưa có dữ liệu
    //     }
    // }, [dispatch, positions, departments]);

    return <div></div>;
};

export default Dashboard;
