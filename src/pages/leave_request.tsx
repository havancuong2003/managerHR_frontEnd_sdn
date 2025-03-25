import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import CreateLeaveRequestModal from "../components/CreateLeaveRequestModal";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const LeaveRequestPage = () => {
    interface LeaveRequest {
        _id: string;
        employeeId: { fullName: string };
        leave_reason: string;
        start_date: string;
        end_date: string;
        status: string;
    }
    const { userId } = useSelector((state: RootState) => state.auth);

    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [filteredLeaveRequests, setFilteredLeaveRequests] = useState<
        LeaveRequest[]
    >([]);
    const [leaveReason, setLeaveReason] = useState("");
    const [remainingLeaveDays, setRemainingLeaveDays] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error" | "warning" | "info"
    >("success");
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/leave_requests/history/employee/${userId}`,
                {
                    withCredentials: true,
                }
            );
            setLeaveRequests(response.data.leaveRequests);
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        }
    };

    const fetchRemainingLeaveDays = async () => {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        try {
            const response = await axios.post(
                `http://localhost:3000/api/leave_requests/remaining-leave-days/${userId}`,
                {
                    month: currentMonth.toString().padStart(2, "0"),
                    year: currentYear.toString(),
                },
                { withCredentials: true }
            );
            setRemainingLeaveDays(response.data.remainingLeaveDays);
        } catch (error) {
            console.error("Error fetching remaining leave days:", error);
        }
    };

    useEffect(() => {
        fetchLeaveRequests();
        fetchRemainingLeaveDays();
    }, []);

    useEffect(() => {
        let filtered = leaveRequests;
        if (leaveReason) {
            filtered = leaveRequests.filter(
                (request) => request.leave_reason === leaveReason
            );
        }
        setTotalPages(Math.ceil(filtered.length / pageSize));
        setFilteredLeaveRequests(
            filtered.slice((page - 1) * pageSize, page * pageSize)
        );
    }, [leaveRequests, leaveReason, page, pageSize]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "#d4edda"; // Màu xanh lá cây nhạt
            case "denied":
                return "#f8d7da"; // Màu đỏ nhạt
            case "pending":
                return "#d1ecf1"; // Màu xanh nhạt
            default:
                return "white";
        }
    };

    return (
        <Box padding={2}>
            <Typography variant="h4" gutterBottom>
                Quản lý yêu cầu nghỉ phép
            </Typography>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={2}
            >
                <FormControl variant="outlined" style={{ minWidth: 200 }}>
                    <InputLabel>Lý do nghỉ</InputLabel>
                    <Select
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        label="Lý do nghỉ"
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="Nghỉ ốm">Nghỉ ốm</MenuItem>
                        <MenuItem value="Nghỉ phép">Nghỉ phép</MenuItem>
                        <MenuItem value="Nghỉ thai sản">Nghỉ thai sản</MenuItem>
                        <MenuItem value="Nghỉ cưới">Nghỉ cưới</MenuItem>
                        <MenuItem value="Nghỉ không lương">
                            Nghỉ không lương
                        </MenuItem>
                    </Select>
                </FormControl>
                <Typography variant="h6">
                    Số ngày nghỉ còn lại trong tháng: {remainingLeaveDays}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setCreateModalOpen(true)}
                    disabled={remainingLeaveDays === 0}
                >
                    Tạo yêu cầu nghỉ phép
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Tên nhân viên</TableCell>
                            <TableCell>Lý do</TableCell>
                            <TableCell>Ngày bắt đầu</TableCell>
                            <TableCell>Ngày kết thúc</TableCell>
                            <TableCell>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLeaveRequests.map((request, index) => (
                            <TableRow
                                key={request._id}
                                style={{
                                    backgroundColor: getStatusColor(
                                        request.status
                                    ),
                                }}
                            >
                                <TableCell>
                                    {(page - 1) * pageSize + index + 1}
                                </TableCell>
                                <TableCell>
                                    {request.employeeId.fullName}
                                </TableCell>
                                <TableCell>{request.leave_reason}</TableCell>
                                <TableCell>
                                    {new Date(
                                        request.start_date
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        request.end_date
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{request.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginTop={2}
            >
                <Button
                    variant="contained"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1 || totalPages === 0}
                >
                    Trước
                </Button>
                <Typography variant="body1" style={{ margin: "0 10px" }}>
                    {page} / {totalPages}
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages || totalPages === 0}
                >
                    Tiếp
                </Button>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <CreateLeaveRequestModal
                open={createModalOpen}
                handleClose={() => setCreateModalOpen(false)}
                refreshLeaveRequests={fetchLeaveRequests}
            />
        </Box>
    );
};

export default LeaveRequestPage;
