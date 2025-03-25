import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from "@mui/material";
import axios from "axios";

interface ViewEmployDepartModalProps {
    open: boolean;
    handleClose: () => void;
    departmentId: string;
}

const ViewEmployDepartModal: React.FC<ViewEmployDepartModalProps> = ({
    open,
    handleClose,
    departmentId,
}) => {
    interface Employee {
        fullName: string;
        dob: string;
        gender: string;
        address: string;
        phone: string;
        positionName: string;
        roleName: string;
        baseSalary: number;
    }

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departmentName, setDepartmentName] = useState("");
    const [numberOfEmployees, setNumberOfEmployees] = useState(0);

    useEffect(() => {
        if (open) {
            const fetchEmployees = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:3000/api/departments/employees/${departmentId}`,
                        { withCredentials: true }
                    );
                    setEmployees(response.data.employees);
                    setDepartmentName(response.data.department);
                    setNumberOfEmployees(response.data.NumberOfEmployees);
                } catch (error) {
                    console.error("Error fetching employees:", error);
                }
            };
            fetchEmployees();
        }
    }, [open, departmentId]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 1200,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2">
                    Nhân viên trong phòng ban: {departmentName}
                </Typography>
                <Typography variant="subtitle1">
                    Số lượng nhân viên: {numberOfEmployees}
                </Typography>
                <TableContainer
                    component={Paper}
                    sx={{ marginTop: 2, maxHeight: "400px", overflowY: "auto" }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Họ và tên</TableCell>
                                <TableCell>Ngày sinh</TableCell>
                                <TableCell>Giới tính</TableCell>
                                <TableCell>Địa chỉ</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Chức vụ</TableCell>
                                <TableCell>Lương cơ bản</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((employee, index) => (
                                <TableRow key={index}>
                                    <TableCell>{employee.fullName}</TableCell>
                                    <TableCell>{employee.dob}</TableCell>
                                    <TableCell>{employee.gender}</TableCell>
                                    <TableCell>{employee.address}</TableCell>
                                    <TableCell>{employee.phone}</TableCell>
                                    <TableCell>
                                        {employee.positionName}
                                    </TableCell>
                                    <TableCell>{employee.baseSalary}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                    >
                        Đóng
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ViewEmployDepartModal;
