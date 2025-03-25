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
    Autocomplete,
    Pagination,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const BonusSalaryPage = () => {
    interface Employee {
        _id: string;
        fullName: string;
        dob: string;
        gender: string;
        address: string;
        phone: string;
        positionName: string;
        baseSalary: number;
    }

    interface BonusSalary {
        _id: string;
        employeeId: string;
        bonus_salary: number;
        description: string;
        payment_date: string;
        createdAt: string;
    }

    interface EmployeeBonus {
        fullName: string;
        gender: string;
        dateOfBirth: string;
        bonusSalaries: BonusSalary[];
    }
    const { userId } = useSelector((state: RootState) => state.auth);

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [bonusSalaries, setBonusSalaries] = useState<EmployeeBonus[]>([]);
    const [searchName, setSearchName] = useState("");
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [month, setMonth] = useState(
        (new Date().getMonth() + 1).toString().padStart(2, "0")
    );
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null
    );
    const [bonusAmount, setBonusAmount] = useState<number | null>(null);
    const [description, setDescription] = useState("");
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedEmployeeBonus, setSelectedEmployeeBonus] =
        useState<EmployeeBonus | null>(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5);
    const [departmentId, setDepartmentId] = useState("");

    const fetchDepartmentId = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/attendances/getDepartmentId/${userId}`,
                {
                    withCredentials: true,
                }
            );
            console.log(response.data.departmentId._id);
            setDepartmentId(response.data.departmentId._id);
        } catch (error) {
            console.error("Error fetching department ID:", error);
        }
    };

    const fetchEmployees = async (departmentId: string) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/departments/employees/${departmentId}`,
                {
                    withCredentials: true,
                }
            );
            setEmployees(response.data.employees);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const fetchBonusSalaries = async (departmentId: string) => {
        try {
            const response = await axios.post(
                `http://localhost:3000/api/bonus_salaries/department/${departmentId}`,
                {
                    year,
                    month,
                },
                { withCredentials: true }
            );
            setBonusSalaries(response.data);
        } catch (error) {
            console.error("Error fetching bonus salaries:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchDepartmentId();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (departmentId) {
            fetchEmployees(departmentId);
            fetchBonusSalaries(departmentId);
        }
    }, [departmentId, year, month]);

    const handleCreateBonusSalary = async () => {
        if (!selectedEmployee || !bonusAmount || !description) {
            setSnackbarMessage("Vui lòng điền đầy đủ thông tin.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        try {
            await axios.post(
                "http://localhost:3000/api/bonus_salaries/add",
                {
                    employeeId: selectedEmployee._id,
                    bonus_salary: bonusAmount,
                    description,
                },
                { withCredentials: true }
            );
            setSnackbarMessage("Thêm trợ cấp thành công!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setCreateModalOpen(false);
            setSelectedEmployee(null);
            setBonusAmount(null);
            setDescription("");
            fetchBonusSalaries(departmentId);
        } catch (error) {
            setSnackbarMessage("Có lỗi xảy ra khi thêm trợ cấp.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        setSelectedEmployee(null);
        setBonusAmount(null);
        setDescription("");
    };

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

    return (
        <Box padding={2}>
            <Typography variant="h4" gutterBottom>
                Quản lý trợ cấp lương
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setCreateModalOpen(true)}
                >
                    Thêm trợ cấp
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Tên nhân viên</TableCell>
                            <TableCell>Giới tính</TableCell>
                            <TableCell>Ngày sinh</TableCell>
                            <TableCell>Tổng trợ cấp</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bonusSalaries
                            .filter((employee) =>
                                employee.fullName
                                    .toLowerCase()
                                    .includes(searchName.toLowerCase())
                            )
                            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                            .map((employee, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {(page - 1) * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell>{employee.fullName}</TableCell>
                                    <TableCell>{employee.gender}</TableCell>
                                    <TableCell>
                                        {new Date(
                                            employee.dateOfBirth
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {employee.bonusSalaries
                                            .filter((bonus) => {
                                                const bonusDate = new Date(
                                                    bonus.createdAt
                                                );
                                                return (
                                                    bonusDate
                                                        .getFullYear()
                                                        .toString() === year &&
                                                    (bonusDate.getMonth() + 1)
                                                        .toString()
                                                        .padStart(2, "0") ===
                                                        month
                                                );
                                            })
                                            .reduce(
                                                (total, bonus) =>
                                                    total + bonus.bonus_salary,
                                                0
                                            )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                setSelectedEmployeeBonus(
                                                    employee
                                                );
                                                setDetailDialogOpen(true);
                                            }}
                                            disabled={
                                                employee.bonusSalaries
                                                    .length === 0
                                            }
                                        >
                                            Chi tiết
                                        </Button>
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
                <Pagination
                    count={Math.ceil(
                        bonusSalaries.filter((employee) =>
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
            <Dialog
                open={createModalOpen}
                onClose={handleCloseCreateModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Thêm trợ cấp lương</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        options={employees}
                        getOptionLabel={(option) => option.fullName}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Chọn nhân viên"
                                variant="outlined"
                            />
                        )}
                        onChange={(event, newValue) =>
                            setSelectedEmployee(newValue)
                        }
                        style={{ marginBottom: "10px" }}
                    />
                    <TextField
                        label="Số tiền trợ cấp"
                        type="number"
                        value={bonusAmount || ""}
                        onChange={(e) => setBonusAmount(Number(e.target.value))}
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: "10px" }}
                    />
                    <TextField
                        label="Mô tả"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: "10px" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateModal} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleCreateBonusSalary} color="primary">
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Chi tiết trợ cấp lương</DialogTitle>
                <DialogContent>
                    {selectedEmployeeBonus && (
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1">
                                    <strong>Tên nhân viên:</strong>{" "}
                                    {selectedEmployeeBonus.fullName}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Giới tính:</strong>{" "}
                                    {selectedEmployeeBonus.gender}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Ngày sinh:</strong>{" "}
                                    {new Date(
                                        selectedEmployeeBonus.dateOfBirth
                                    ).toLocaleDateString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                {selectedEmployeeBonus.bonusSalaries
                                    .filter((bonus) => {
                                        const bonusDate = new Date(
                                            bonus.createdAt
                                        );
                                        return (
                                            bonusDate
                                                .getFullYear()
                                                .toString() === year &&
                                            (bonusDate.getMonth() + 1)
                                                .toString()
                                                .padStart(2, "0") === month
                                        );
                                    })
                                    .map((bonus) => (
                                        <Box key={bonus._id} marginBottom={2}>
                                            <Typography variant="body1">
                                                <strong>Số tiền:</strong>{" "}
                                                {bonus.bonus_salary}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Mô tả:</strong>{" "}
                                                {bonus.description}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>
                                                    Ngày thanh toán:
                                                </strong>{" "}
                                                {new Date(
                                                    bonus.payment_date
                                                ).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    ))}
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

export default BonusSalaryPage;
