import React, { useState } from "react";
import axios from "axios";
import {
    Button,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
} from "@mui/material";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
const baseURL = "http://localhost:3000/api/attendances/employee";

interface DatePickerFormProps {
    onFetchData: (
        data: any,
        filter: boolean,
        startDate: string,
        endDate: string
    ) => void;
}

const DatePickerForm: React.FC<DatePickerFormProps> = ({ onFetchData }) => {
    const { userId } = useSelector((state: RootState) => state.auth);
    const [startDate, setStartDate] = useState("2025-03-01");
    const [endDate, setEndDate] = useState("2025-03-31");
    const [filterWorkingDays, setFilterWorkingDays] = useState(false);

    const handleFetchData = async () => {
        try {
            const response = await axios.post(
                `${baseURL}/${userId}`,
                { startDate, endDate },
                { withCredentials: true }
            );
            onFetchData(response.data, filterWorkingDays, startDate, endDate);
        } catch (error) {
            console.error("Error fetching attendance data", error);
        }
    };

    return (
        <Card sx={{ p: 2, mb: 2, mt: 2, mr: 2 }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Time Checking
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                        label="Bắt đầu"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        sx={{ width: 500 }}
                        size="small"
                    />
                    <TextField
                        label="Kết thúc"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={{ width: 500 }}
                        size="small"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filterWorkingDays}
                                onChange={() =>
                                    setFilterWorkingDays(!filterWorkingDays)
                                }
                            />
                        }
                        label="Chỉ ngày đi làm"
                    />
                </Box>
                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFetchData}
                        size="large"
                    >
                        Check
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

interface AttendanceData {
    details: { timeIn: string; timeOut: string }[];
    totalWorkHours: number;
    totalOTHours: number;
    startDate: string;
    endDate: string;
}

const AttendanceTable: React.FC<{
    data: AttendanceData;
    filterWorkingDays: boolean;
    startDate: string;
    endDate: string;
}> = ({ data, filterWorkingDays, startDate, endDate }) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const allDays = [];
    let totalWorkHours = 0;
    let totalOTHours = 0;

    for (
        let date = start;
        date.isBefore(end) || date.isSame(end);
        date = date.add(1, "day")
    ) {
        allDays.push(date);
    }

    return (
        <Card sx={{ p: 2, mb: 2, mt: 2, mr: 2 }}>
            <CardContent>
                <Typography variant="h6">Bảng Chấm Công</Typography>
                <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ngày</TableCell>
                                <TableCell>Giờ Check-in</TableCell>
                                <TableCell>Giờ Check-out</TableCell>
                                <TableCell>Giờ Làm Việc</TableCell>
                                <TableCell>OT (Giờ)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allDays.map((date) => {
                                const formattedDate = date.format("YYYY-MM-DD");
                                const record = data.details.find(
                                    (d) =>
                                        dayjs(d.timeIn).format("YYYY-MM-DD") ===
                                        formattedDate
                                );
                                if (filterWorkingDays && !record) return null;

                                const isWeekend =
                                    date.day() === 6 || date.day() === 0;
                                const bgColor = record
                                    ? "#90ee90" // Xanh lá cho ngày đi làm
                                    : isWeekend
                                    ? "#add8e6" // Xanh dương cho thứ 7, CN
                                    : "#ffcccc"; // Đỏ cho ngày không đi làm

                                let timeIn = record
                                    ? dayjs(record.timeIn)
                                    : null;
                                let timeOut = record
                                    ? dayjs(record.timeOut)
                                    : null;

                                let workHours = 0;
                                if (timeIn && timeOut) {
                                    workHours = timeOut.diff(
                                        timeIn,
                                        "hour",
                                        true
                                    );
                                    if (workHours > 1) workHours -= 1;
                                }

                                let otHours =
                                    workHours > 8.5
                                        ? Math.ceil(workHours - 8.5)
                                        : 0;
                                totalWorkHours += workHours;
                                totalOTHours += otHours;

                                return (
                                    <TableRow
                                        key={formattedDate}
                                        sx={{ backgroundColor: bgColor }}
                                    >
                                        <TableCell>{formattedDate}</TableCell>
                                        <TableCell>
                                            {timeIn
                                                ? timeIn.format("HH:mm:ss")
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {timeOut
                                                ? timeOut.format("HH:mm:ss")
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {workHours.toFixed(2)}
                                        </TableCell>
                                        <TableCell>{otHours}</TableCell>
                                    </TableRow>
                                );
                            })}
                            <TableRow>
                                <TableCell colSpan={3} align="right">
                                    <strong>Tổng cộng</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>{totalWorkHours.toFixed(2)}</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>{totalOTHours}</strong>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default function AttendanceReport() {
    const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
        null
    );
    const [filterWorkingDays, setFilterWorkingDays] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState("2025-03-01");
    const [selectedEndDate, setSelectedEndDate] = useState("2025-03-31");

    return (
        <div>
            <DatePickerForm
                onFetchData={(data, filter, startDate, endDate) => {
                    setAttendanceData(data);
                    setFilterWorkingDays(filter);
                    setSelectedStartDate(startDate);
                    setSelectedEndDate(endDate);
                }}
            />
            {attendanceData && (
                <AttendanceTable
                    data={attendanceData}
                    filterWorkingDays={filterWorkingDays}
                    startDate={selectedStartDate}
                    endDate={selectedEndDate}
                />
            )}
        </div>
    );
}
