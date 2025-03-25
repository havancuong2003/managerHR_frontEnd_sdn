import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchPositions } from "../redux/reducers/positionReducer";
import { fetchDepartments } from "../redux/reducers/departmentsReducer";
import axios from "axios";
import dayjs from "dayjs";
import { AttendancePage } from "../components/AttendanceComponent";

const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div>
            <AttendancePage />
        </div>
    );
};

export default Dashboard;
