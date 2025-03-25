import { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export interface Attendance {
    _id: string;
    employeeId: string;
    status: string;
    timeIn: string;
    timeOut?: string;
}

const baseURL = "http://localhost:3000/api/attendances";

export const CheckInCheckOutButton = ({
    checkedIn,
    fetchAttendanceData,
}: {
    checkedIn: boolean;
    fetchAttendanceData: () => void;
}) => {
    const { userId } = useSelector((state: RootState) => state.auth);

    const handleCheckIn = async () => {
        if (!userId) return;
        try {
            const res = await axios.post(
                `${baseURL}/check-in/${userId}`,
                {},
                { withCredentials: true }
            );
            toast.success(res.data.message);
            fetchAttendanceData();
        } catch (error) {
            toast.error("Check-in thất bại!");
        }
    };

    const handleCheckOut = async () => {
        if (!userId) return;
        try {
            const res = await axios.post(
                `${baseURL}/check-out/${userId}`,
                {},
                { withCredentials: true }
            );
            toast.success(res.data.message);
            fetchAttendanceData();
        } catch (error) {
            toast.error("Check-out thất bại!");
        }
    };

    return (
        <Card
            sx={{
                p: 2,
                textAlign: "center",
                flex: 1,
                boxShadow: 1,
                minWidth: 250,
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Chấm Công
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCheckIn}
                    disabled={checkedIn}
                    sx={{ m: 1, width: "100%" }}
                >
                    Check-in
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCheckOut}
                    disabled={!checkedIn}
                    sx={{ m: 1, width: "100%" }}
                >
                    Check-out
                </Button>
            </CardContent>
        </Card>
    );
};

export const AttendancePage = () => {
    const { userId } = useSelector((state: RootState) => state.auth);
    const [attendance, setAttendance] = useState<Attendance | null>(null);
    const [checkedIn, setCheckedIn] = useState(false);

    const fetchAttendanceData = useCallback(() => {
        if (!userId) return;
        axios
            .get(`${baseURL}/getCheckIn/${userId}`, { withCredentials: true })
            .then((res) => {
                if (res.data.message) {
                    setCheckedIn(false);
                } else {
                    setAttendance(res.data);
                    setCheckedIn(true);
                }
            })
            .catch((err) => console.error(err));
    }, [userId]);

    useEffect(() => {
        fetchAttendanceData();
    }, [fetchAttendanceData]);

    const calculateWorkHours = () => {
        if (!attendance || !attendance.timeIn || !attendance.timeOut)
            return { workHours: "0.00", otHours: 0 };

        let timeIn = dayjs(attendance.timeIn);
        let timeOut = dayjs(attendance.timeOut);

        if (timeIn.hour() === 12) timeIn = timeIn.hour(13).minute(0).second(0);
        if (timeOut.hour() === 12)
            timeOut = timeOut.hour(12).minute(0).second(0);

        let totalMinutes = timeOut.diff(timeIn, "minute");
        if (timeIn.hour() < 12 && timeOut.hour() > 13) {
            totalMinutes -= 60;
        }

        let workHours = Math.min(8, totalMinutes / 60);
        let otHours = Math.max(0, Math.floor((totalMinutes - 480) / 30));
        if (otHours > 2) otHours = 2;

        return { workHours: workHours.toFixed(2), otHours };
    };

    const { workHours, otHours } = calculateWorkHours();

    return (
        <div
            style={{
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                paddingRight: "20px",
                marginTop: "20px",
            }}
        >
            <CheckInCheckOutButton
                checkedIn={checkedIn}
                fetchAttendanceData={fetchAttendanceData}
            />
            <Card sx={{ p: 2, flex: 2, boxShadow: 1 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Thông Tin Chấm Công
                    </Typography>
                    <TableContainer>
                        <Table>
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
                                {attendance ? (
                                    <TableRow>
                                        <TableCell>
                                            {dayjs(attendance.timeIn).format(
                                                "YYYY-MM-DD"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {dayjs(attendance.timeIn).format(
                                                "HH:mm:ss"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {attendance.timeOut
                                                ? dayjs(
                                                      attendance.timeOut
                                                  ).format("HH:mm:ss")
                                                : "Chưa Check-out"}
                                        </TableCell>
                                        <TableCell>{workHours}</TableCell>
                                        <TableCell>{otHours}</TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Chưa có dữ liệu chấm công hôm nay.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </div>
    );
};
