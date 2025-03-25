import React, { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const AttendanceManagement: React.FC = () => {
    const { userId } = useSelector((state: RootState) => state.auth);

    const [year, setYear] = useState("2025");
    const [month, setMonth] = useState("03");
    const [departmentName, setDepartmentName] = useState("");
    const [attendanceData, setAttendanceData] = useState<any[]>([]);

    const fetchAttendanceData = async () => {
        try {
            // Lấy departmentId từ API
            const deptResponse = await axios.get(
                `http://localhost:3000/api/attendances/getDepartmentId/${userId}`,
                { withCredentials: true }
            );
            const departmentId = deptResponse.data.departmentId._id;
            setDepartmentName(deptResponse.data.departmentId.name);

            // Gọi API lấy dữ liệu chấm công
            const attendanceResponse = await axios.post(
                `http://localhost:3000/api/attendances/department/${departmentId}/report`,
                { year, month },
                { withCredentials: true }
            );

            setAttendanceData(attendanceResponse.data);
        } catch (error) {
            console.error("Error fetching attendance data", error);
        }
    };

    return (
        <Card sx={{ p: 2, mb: 2, mt: 2, mr: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Quản lý lịch đi làm của nhân viên
                </Typography>

                {/* Bộ lọc chọn năm và tháng */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "10px",
                    }}
                >
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Năm</InputLabel>
                        <Select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <MenuItem value="2024">2024</MenuItem>
                            <MenuItem value="2025">2025</MenuItem>
                            <MenuItem value="2026">2026</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Tháng</InputLabel>
                        <Select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            {[...Array(12)].map((_, i) => {
                                const monthValue = (i + 1)
                                    .toString()
                                    .padStart(2, "0");
                                return (
                                    <MenuItem
                                        key={monthValue}
                                        value={monthValue}
                                    >
                                        {monthValue}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={fetchAttendanceData}
                    >
                        Load dữ liệu
                    </Button>
                </div>

                {/* Bảng hiển thị dữ liệu với cuộn dọc */}
                <TableContainer
                    component={Paper}
                    sx={{ maxHeight: "600px", overflowY: "auto" }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Phòng ban</TableCell>
                                <TableCell>Tên nhân viên</TableCell>
                                <TableCell>Vị trí</TableCell>
                                <TableCell>Số ngày làm việc</TableCell>
                                <TableCell>Số giờ OT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attendanceData.length > 0 ? (
                                attendanceData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{departmentName}</TableCell>
                                        <TableCell>{item.fullName}</TableCell>
                                        <TableCell>
                                            {item.positionName}
                                        </TableCell>
                                        <TableCell>{item.workDays}</TableCell>
                                        <TableCell>
                                            {item.totalOTHours.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default AttendanceManagement;
