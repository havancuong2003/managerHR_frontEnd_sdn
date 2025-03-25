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
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert,
    Grid,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ManageLeaveRequestPage = () => {
    const { userId } = useSelector((state: RootState) => state.auth);

    interface LeaveRequest {
        _id: string;
        employeeId: {
            fullName: string;
            phone: string;
            gender: string;
        };
        leave_reason: string;
        start_date: string;
        end_date: string;
        status: string;
        createAt: string;
    }

    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [filteredLeaveRequests, setFilteredLeaveRequests] = useState<
        LeaveRequest[]
    >([]);
    const [searchName, setSearchName] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [showPendingOnly, setShowPendingOnly] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmDialogAction, setConfirmDialogAction] = useState<
        "approved" | "denied"
    >("approved");
    const [selectedRequestId, setSelectedRequestId] = useState("");
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedRequestDetail, setSelectedRequestDetail] =
        useState<LeaveRequest | null>(null);

    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/leave_requests/history/manager/${userId}`,
                {
                    withCredentials: true,
                }
            );
            setLeaveRequests(response.data.leaveRequests);
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        }
    };

    const fetchPendingLeaveRequests = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/leave_requests/pending-requests/${userId}`,
                {
                    withCredentials: true,
                }
            );
            setLeaveRequests(response.data.pendingLeaveRequests);
        } catch (error) {
            console.error("Error fetching pending leave requests:", error);
        }
    };

    useEffect(() => {
        if (showPendingOnly) {
            fetchPendingLeaveRequests();
        } else {
            fetchLeaveRequests();
        }
    }, [showPendingOnly]);

    useEffect(() => {
        let filtered = leaveRequests;
        if (searchName) {
            filtered = filtered.filter((request) =>
                request.employeeId.fullName
                    .toLowerCase()
                    .includes(searchName.toLowerCase())
            );
        }
        if (sortOrder === "asc") {
            filtered.sort(
                (a, b) =>
                    new Date(a.createAt).getTime() -
                    new Date(b.createAt).getTime()
            );
        } else {
            filtered.sort(
                (a, b) =>
                    new Date(b.createAt).getTime() -
                    new Date(a.createAt).getTime()
            );
        }
        setTotalPages(Math.ceil(filtered.length / pageSize));
        setFilteredLeaveRequests(
            filtered.slice((page - 1) * pageSize, page * pageSize)
        );
    }, [leaveRequests, searchName, sortOrder, page, pageSize]);

    const handleConfirmAction = async () => {
        try {
            await axios.put(
                "http://localhost:3000/api/leave_requests/update",
                {
                    id: selectedRequestId,
                    status: confirmDialogAction,
                },
                { withCredentials: true }
            );
            setSnackbarMessage(
                `Yêu cầu nghỉ phép đã được ${
                    confirmDialogAction === "approved" ? "duyệt" : "từ chối"
                }!`
            );
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setConfirmDialogOpen(false);
            fetchLeaveRequests();
        } catch (error) {
            setSnackbarMessage("Có lỗi xảy ra khi cập nhật yêu cầu nghỉ phép.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

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
                <TextField
                    label="Tìm kiếm theo tên"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    variant="outlined"
                    style={{ marginRight: "10px" }}
                />
                <FormControl
                    variant="outlined"
                    style={{ minWidth: 200, marginRight: "10px" }}
                >
                    <InputLabel>Sắp xếp theo</InputLabel>
                    <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Sắp xếp theo"
                    >
                        <MenuItem value="desc">Gần nhất</MenuItem>
                        <MenuItem value="asc">Cũ nhất</MenuItem>
                    </Select>
                </FormControl>
                <FormControl
                    variant="outlined"
                    style={{ minWidth: 200, marginRight: "10px" }}
                >
                    <InputLabel>Chỉ hiện pending</InputLabel>
                    <Select
                        value={showPendingOnly ? "yes" : "no"}
                        onChange={(e) =>
                            setShowPendingOnly(e.target.value === "yes")
                        }
                        label="Chỉ hiện pending"
                    >
                        <MenuItem value="no">Không</MenuItem>
                        <MenuItem value="yes">Có</MenuItem>
                    </Select>
                </FormControl>
                {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={
                        showPendingOnly
                            ? fetchPendingLeaveRequests
                            : fetchLeaveRequests
                    }
                >
                    Load
                </Button> */}
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
                            <TableCell>Thời gian tạo</TableCell>
                            <TableCell>Action</TableCell>
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
                                <TableCell>
                                    {new Date(
                                        request.createAt
                                    ).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {request.status === "pending" ? (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    setSelectedRequestId(
                                                        request._id
                                                    );
                                                    setConfirmDialogAction(
                                                        "approved"
                                                    );
                                                    setConfirmDialogOpen(true);
                                                }}
                                                style={{ marginRight: "10px" }}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => {
                                                    setSelectedRequestId(
                                                        request._id
                                                    );
                                                    setConfirmDialogAction(
                                                        "denied"
                                                    );
                                                    setConfirmDialogOpen(true);
                                                }}
                                            >
                                                Deny
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                setSelectedRequestDetail(
                                                    request
                                                );
                                                setDetailDialogOpen(true);
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    )}
                                </TableCell>
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
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
            >
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn{" "}
                        {confirmDialogAction === "approved"
                            ? "duyệt"
                            : "từ chối"}{" "}
                        yêu cầu nghỉ phép này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDialogOpen(false)}
                        color="primary"
                    >
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmAction} color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Chi tiết yêu cầu nghỉ phép</DialogTitle>
                <DialogContent>
                    {selectedRequestDetail && (
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1">
                                    <strong>Tên nhân viên:</strong>{" "}
                                    {selectedRequestDetail.employeeId.fullName}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Số điện thoại:</strong>{" "}
                                    {selectedRequestDetail.employeeId.phone}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Giới tính:</strong>{" "}
                                    {selectedRequestDetail.employeeId.gender}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">
                                    <strong>Thời gian tạo:</strong>{" "}
                                    {new Date(
                                        selectedRequestDetail.createAt
                                    ).toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Ngày bắt đầu:</strong>{" "}
                                    {new Date(
                                        selectedRequestDetail.start_date
                                    ).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Ngày kết thúc:</strong>{" "}
                                    {new Date(
                                        selectedRequestDetail.end_date
                                    ).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Trạng thái:</strong>{" "}
                                    {selectedRequestDetail.status}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDetailDialogOpen(false)}
                        color="primary"
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
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
        </Box>
    );
};

export default ManageLeaveRequestPage;
