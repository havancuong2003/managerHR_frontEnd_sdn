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
    Snackbar,
    Alert,
    Pagination,
    Checkbox,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ManageSalaryPage = () => {
    const { userId } = useSelector((state: RootState) => state.auth);

    const [departmentId, setDepartmentId] = useState("");
    const [searchName, setSearchName] = useState("");
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [month, setMonth] = useState(
        (new Date().getMonth() + 1).toString().padStart(2, "0")
    );
    const [quarter, setQuarter] = useState("1");
    const [reportType, setReportType] = useState("monthly");
    interface Employee {
        id: string;
        fullName: string;
        gender: string;
        workDays?: number;
        totalOTHours?: number;
        baseSalary?: number;
        bonus_salary?: number;
        remainingLeaveDays?: number;
        dailyWage?: number;
        totalSalary?: number;
        monthlySalaries?: {
            month1: number;
            month2: number;
            month3: number;
        };
    }

    const [salaries, setSalaries] = useState<Employee[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5);

    const fetchDepartmentId = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/attendances/getDepartmentId/${userId}`,
                {
                    withCredentials: true,
                }
            );
            setDepartmentId(response.data.departmentId._id);
        } catch (error) {
            console.error("Error fetching department ID:", error);
        }
    };

    const fetchMonthlyReport = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/salaries/department/report",
                {
                    departmentId,
                    month,
                    year,
                },
                { withCredentials: true }
            );
            setSalaries(response.data);
        } catch (error) {
            console.error("Error fetching monthly report:", error);
        }
    };

    const fetchQuarterlyReport = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/salaries/department/quarterly-report",
                {
                    departmentId,
                    quarter,
                    year,
                },
                { withCredentials: true }
            );
            setSalaries(response.data);
        } catch (error) {
            console.error("Error fetching quarterly report:", error);
        }
    };

    useEffect(() => {
        fetchDepartmentId();
    }, []);

    useEffect(() => {
        if (departmentId) {
            if (reportType === "monthly") {
                fetchMonthlyReport();
            } else {
                fetchQuarterlyReport();
            }
        }
    }, [departmentId, reportType, month, year, quarter]);

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allEmployeeIds = salaries.map((salary: any) => salary.id);
            setSelectedEmployees(allEmployeeIds);
        } else {
            setSelectedEmployees([]);
        }
    };

    const handleSelectEmployee = (
        event: React.ChangeEvent<HTMLInputElement>,
        id: string
    ) => {
        if (event.target.checked) {
            setSelectedEmployees((prev) => [...prev, id]);
        } else {
            setSelectedEmployees((prev) =>
                prev.filter((employeeId) => employeeId !== id)
            );
        }
    };

    const handleAddSalaries = async () => {
        try {
            const currentDate = new Date().toISOString().split("T")[0];
            const promises = selectedEmployees.map((employeeId) => {
                const employee = salaries.find(
                    (salary: any) => salary.id === employeeId
                );
                return axios.post(
                    "http://localhost:3000/api/salaries/add",
                    {
                        employeeId,
                        total_salary: Math.round(employee?.totalSalary || 0),
                        payment_date: currentDate,
                        description: `lương tháng ${month}`,
                    },
                    { withCredentials: true }
                );
            });
            await Promise.all(promises);
            setSnackbarMessage("Thêm lương thành công!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setSelectedEmployees([]);
        } catch (error) {
            setSnackbarMessage("Có lỗi xảy ra khi thêm lương.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <Box padding={2}>
            <Typography variant="h4" gutterBottom>
                Quản lý lương nhân viên
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
                    style={{ minWidth: 120, marginRight: "10px" }}
                >
                    <InputLabel>Loại báo cáo</InputLabel>
                    <Select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        label="Loại báo cáo"
                    >
                        <MenuItem value="monthly">Theo tháng</MenuItem>
                        <MenuItem value="quarterly">Theo quý</MenuItem>
                    </Select>
                </FormControl>
                {reportType === "monthly" ? (
                    <>
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
                    </>
                ) : (
                    <>
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
                            <InputLabel>Quý</InputLabel>
                            <Select
                                value={quarter}
                                onChange={(e) => setQuarter(e.target.value)}
                                label="Quý"
                            >
                                <MenuItem value="1">Quý 1</MenuItem>
                                <MenuItem value="2">Quý 2</MenuItem>
                                <MenuItem value="3">Quý 3</MenuItem>
                                <MenuItem value="4">Quý 4</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                )}
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {reportType === "monthly" && (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            selectedEmployees.length > 0 &&
                                            selectedEmployees.length <
                                                salaries.length
                                        }
                                        checked={
                                            salaries.length > 0 &&
                                            selectedEmployees.length ===
                                                salaries.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                            )}
                            <TableCell>#</TableCell>
                            <TableCell>Tên nhân viên</TableCell>
                            <TableCell>Giới tính</TableCell>
                            {reportType === "monthly" ? (
                                <>
                                    <TableCell>Số ngày làm việc</TableCell>
                                    <TableCell>Số giờ OT</TableCell>
                                    <TableCell>Lương cơ bản</TableCell>
                                    <TableCell>Tiền lương bonus</TableCell>
                                    <TableCell>
                                        Số ngày nghỉ phép còn lại
                                    </TableCell>
                                    <TableCell>Lương theo ngày</TableCell>
                                    <TableCell>Tổng tiền lương</TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>Lương tháng 1</TableCell>
                                    <TableCell>Lương tháng 2</TableCell>
                                    <TableCell>Lương tháng 3</TableCell>
                                    <TableCell>Tổng lương quý</TableCell>
                                </>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salaries
                            .filter((employee: any) =>
                                employee.fullName
                                    .toLowerCase()
                                    .includes(searchName.toLowerCase())
                            )
                            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                            .map((employee: any, index: number) => (
                                <TableRow key={employee.id}>
                                    {reportType === "monthly" && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedEmployees.includes(
                                                    employee.id
                                                )}
                                                onChange={(event) =>
                                                    handleSelectEmployee(
                                                        event,
                                                        employee.id
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        {(page - 1) * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell>{employee.fullName}</TableCell>
                                    <TableCell>{employee.gender}</TableCell>
                                    {reportType === "monthly" ? (
                                        <>
                                            <TableCell>
                                                {employee.workDays}
                                            </TableCell>
                                            <TableCell>
                                                {Math.round(
                                                    employee.totalOTHours
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {Math.round(
                                                    employee.baseSalary
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {Math.round(
                                                    employee.bonus_salary
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {employee.remainingLeaveDays}
                                            </TableCell>
                                            <TableCell>
                                                {Math.round(employee.dailyWage)}
                                            </TableCell>
                                            <TableCell>
                                                {Math.round(
                                                    employee.totalSalary
                                                )}
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>
                                                {employee.monthlySalaries
                                                    ?.month1 ?? 0}
                                            </TableCell>
                                            <TableCell>
                                                {employee.monthlySalaries
                                                    ?.month2 ?? 0}
                                            </TableCell>
                                            <TableCell>
                                                {employee.monthlySalaries
                                                    ?.month3 ?? 0}
                                            </TableCell>
                                            <TableCell>
                                                {Math.round(
                                                    employee.totalSalary
                                                )}
                                            </TableCell>
                                        </>
                                    )}
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
                        salaries.filter((employee: any) =>
                            employee.fullName
                                .toLowerCase()
                                .includes(searchName.toLowerCase())
                        ).length / rowsPerPage
                    )}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
            {reportType === "monthly" && (
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    marginTop={2}
                >
                    <Typography variant="h6">
                        Tổng lương trong tháng:{" "}
                        {Math.round(
                            salaries.reduce(
                                (total: number, employee: any) =>
                                    total + employee.totalSalary,
                                0
                            )
                        )}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddSalaries}
                        disabled={selectedEmployees.length === 0}
                    >
                        Thêm Salary cho nhân viên
                    </Button>
                </Box>
            )}
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

export default ManageSalaryPage;
