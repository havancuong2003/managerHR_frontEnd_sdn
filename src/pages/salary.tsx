import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
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
    Snackbar,
    Alert,
    Pagination,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const SalaryPage = () => {
    const { userId } = useSelector((state: RootState) => state.auth);

    const [salaries, setSalaries] = useState([]);
    const [searchDescription, setSearchDescription] = useState("");
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [month, setMonth] = useState(
        (new Date().getMonth() + 1).toString().padStart(2, "0")
    );
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");

    const fetchSalaries = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/salaries/employee/${userId}`,
                {
                    withCredentials: true,
                }
            );
            setSalaries(response.data);
        } catch (error) {
            setSnackbarMessage("Có lỗi xảy ra khi lấy dữ liệu lương.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        fetchSalaries();
    }, [year, month]);

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

    return (
        <Box padding={2}>
            <Typography variant="h4" gutterBottom>
                Xem lương nhân viên
            </Typography>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={2}
            >
                <TextField
                    label="Tìm kiếm theo mô tả"
                    value={searchDescription}
                    onChange={(e) => setSearchDescription(e.target.value)}
                    variant="outlined"
                    style={{ marginRight: "10px" }}
                />
                <TextField
                    label="Năm"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    variant="outlined"
                    style={{ marginRight: "10px" }}
                />
                <FormControl
                    variant="outlined"
                    style={{ minWidth: 120, marginRight: "10px" }}
                >
                    <InputLabel>Tháng</InputLabel>
                    <Select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        label="Tháng"
                    >
                        <MenuItem value="01">Tháng 1</MenuItem>
                        <MenuItem value="02">Tháng 2</MenuItem>
                        <MenuItem value="03">Tháng 3</MenuItem>
                        <MenuItem value="04">Tháng 4</MenuItem>
                        <MenuItem value="05">Tháng 5</MenuItem>
                        <MenuItem value="06">Tháng 6</MenuItem>
                        <MenuItem value="07">Tháng 7</MenuItem>
                        <MenuItem value="08">Tháng 8</MenuItem>
                        <MenuItem value="09">Tháng 9</MenuItem>
                        <MenuItem value="10">Tháng 10</MenuItem>
                        <MenuItem value="11">Tháng 11</MenuItem>
                        <MenuItem value="12">Tháng 12</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Số dòng mỗi trang"
                    type="number"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    variant="outlined"
                    style={{ marginRight: "10px" }}
                />
            </Box>
            <TableContainer component={Paper} style={{ maxHeight: 400 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Tên nhân viên</TableCell>
                            <TableCell>Giới tính</TableCell>
                            <TableCell>Ngày thanh toán</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Tiền lương</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salaries
                            .filter((salary: any) => {
                                const paymentDate = new Date(
                                    salary.payment_date
                                );
                                return (
                                    salary.description
                                        .toLowerCase()
                                        .includes(
                                            searchDescription.toLowerCase()
                                        ) &&
                                    paymentDate.getFullYear().toString() ===
                                        year &&
                                    (paymentDate.getMonth() + 1)
                                        .toString()
                                        .padStart(2, "0") === month
                                );
                            })
                            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                            .map((salary: any, index: number) => (
                                <TableRow key={salary._id}>
                                    <TableCell>
                                        {(page - 1) * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {salary.employeeId.fullName}
                                    </TableCell>
                                    <TableCell>
                                        {salary.employeeId.gender}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            salary.payment_date
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{salary.description}</TableCell>
                                    <TableCell>{salary.total_salary}</TableCell>
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
                <Pagination
                    count={Math.ceil(
                        salaries.filter((salary: any) => {
                            const paymentDate = new Date(salary.payment_date);
                            return (
                                salary.description
                                    .toLowerCase()
                                    .includes(
                                        searchDescription.toLowerCase()
                                    ) &&
                                paymentDate.getFullYear().toString() === year &&
                                (paymentDate.getMonth() + 1)
                                    .toString()
                                    .padStart(2, "0") === month
                            );
                        }).length / rowsPerPage
                    )}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
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
        </Box>
    );
};

export default SalaryPage;
