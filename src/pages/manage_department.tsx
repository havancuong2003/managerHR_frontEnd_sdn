import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    TextField,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    InputLabel,
    FormControl,
} from "@mui/material";
import AddDepartmentModal from "../components/AddDepartmentModal";
import ViewEmployDepartModal from "../components/ViewEmployDepartModal";
import UpdateDepartmentModal from "../components/UpdateDepartModal";
const DepartmentManagement = () => {
    const [departments, setDepartments] = useState<
        {
            _id: string;
            name: string;
            description: string;
            numberOfEmployees: number;
        }[]
    >([]);
    const [filteredDepartments, setFilteredDepartments] = useState<
        {
            _id: string;
            name: string;
            description: string;
            numberOfEmployees: number;
        }[]
    >([]);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [totalPages, setTotalPages] = useState(1);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState("");
    const [selectedDepartmentDescription, setSelectedDepartmentDescription] =
        useState("");

    const handleOpenAddModal = () => setAddModalOpen(true);
    const handleCloseAddModal = () => setAddModalOpen(false);

    const handleOpenViewModal = (departmentId: string) => {
        setSelectedDepartmentId(departmentId);
        setViewModalOpen(true);
    };
    const handleCloseViewModal = () => setViewModalOpen(false);

    const handleOpenUpdateModal = (
        departmentId: string,
        name: string,
        description: string
    ) => {
        setSelectedDepartmentId(departmentId);
        setSelectedDepartmentName(name);
        setSelectedDepartmentDescription(description);
        setUpdateModalOpen(true);
    };
    const handleCloseUpdateModal = () => setUpdateModalOpen(false);
    const refreshDepartments = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/departments",
                { withCredentials: true }
            );
            const departmentsWithEmployees = await Promise.all(
                response.data.map(
                    async (dept: {
                        _id: string;
                        name: string;
                        description: string;
                        numberOfEmployees: number;
                    }) => {
                        const employeeResponse = await axios.get(
                            `http://localhost:3000/api/departments/employees/${dept._id}`,
                            { withCredentials: true }
                        );
                        return {
                            ...dept,
                            numberOfEmployees:
                                employeeResponse.data.NumberOfEmployees,
                        };
                    }
                )
            );
            setDepartments(departmentsWithEmployees);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        refreshDepartments();
    }, []);

    useEffect(() => {
        let filtered = departments.filter(
            (dept) =>
                dept.name.toLowerCase().includes(search.toLowerCase()) ||
                dept.description.toLowerCase().includes(search.toLowerCase())
        );

        filtered.sort((a, b) => {
            if (sortKey === "name") {
                return sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortKey === "numberOfEmployees") {
                return sortOrder === "asc"
                    ? a.numberOfEmployees - b.numberOfEmployees
                    : b.numberOfEmployees - a.numberOfEmployees;
            }
            return 0;
        });

        setTotalPages(Math.ceil(filtered.length / pageSize));
        setFilteredDepartments(
            filtered.slice((page - 1) * pageSize, page * pageSize)
        );
    }, [search, departments, sortKey, sortOrder, page, pageSize]);

    return (
        <Box padding={2}>
            <Box
                padding={2}
                marginBottom={2}
                borderRadius={2}
                sx={{ backgroundColor: "white" }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Box display="flex" alignItems="center">
                    <FormControl
                        variant="outlined"
                        style={{ marginRight: "10px" }}
                    >
                        <small>Tìm kiếm theo tên, description</small>
                        <TextField
                            id="search"
                            label="Tìm kiếm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </FormControl>
                    <FormControl
                        variant="outlined"
                        style={{ marginRight: "10px" }}
                    >
                        <small>Sắp xếp theo</small>
                        <Select
                            id="sortKey"
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                        >
                            <MenuItem value="name">Tên</MenuItem>
                            <MenuItem value="numberOfEmployees">
                                Số nhân viên
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        variant="outlined"
                        style={{ marginRight: "10px" }}
                    >
                        <small>Thứ tự</small>
                        <Select
                            id="sortOrder"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <MenuItem value="asc">Tăng dần</MenuItem>
                            <MenuItem value="desc">Giảm dần</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button
                    variant="contained"
                    style={{ backgroundColor: "#4CAF50", color: "white" }}
                    onClick={handleOpenAddModal}
                >
                    Tạo phòng ban
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                style={{ maxHeight: "550px", overflowY: "auto" }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Số nhân viên</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDepartments.map((dept, index) => (
                            <TableRow key={dept._id}>
                                <TableCell>
                                    {(page - 1) * pageSize + index + 1}
                                </TableCell>
                                <TableCell>{dept.name}</TableCell>
                                <TableCell>{dept.description}</TableCell>
                                <TableCell>{dept.numberOfEmployees}</TableCell>
                                <TableCell>
                                    <Box display="flex" flexDirection="column">
                                        <Button
                                            variant="contained"
                                            style={{
                                                backgroundColor: "#2196F3", // Màu nhạt hơn
                                                color: "white",
                                                marginBottom: "5px",
                                            }}
                                            onClick={() =>
                                                handleOpenViewModal(dept._id)
                                            }
                                        >
                                            Xem nhân viên
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                backgroundColor: "#FF9800", // Màu nhạt hơn
                                                color: "white",
                                            }}
                                            onClick={() =>
                                                handleOpenUpdateModal(
                                                    dept._id,
                                                    dept.name,
                                                    dept.description
                                                )
                                            }
                                        >
                                            Sửa
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box
                marginTop={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Trước
                </Button>
                <span style={{ margin: "0 10px" }}>
                    {page} / {totalPages}
                </span>
                <Button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Tiếp
                </Button>
                <TextField
                    type="number"
                    label="Số phòng ban / trang"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    style={{ marginLeft: "10px", width: "150px" }}
                />
            </Box>

            <AddDepartmentModal
                open={addModalOpen}
                handleClose={handleCloseAddModal}
                refreshDepartments={refreshDepartments}
            />
            <ViewEmployDepartModal
                open={viewModalOpen}
                handleClose={handleCloseViewModal}
                departmentId={selectedDepartmentId}
            />
            <UpdateDepartmentModal
                open={updateModalOpen}
                handleClose={handleCloseUpdateModal}
                departmentId={selectedDepartmentId}
                initialName={selectedDepartmentName}
                initialDescription={selectedDepartmentDescription}
                refreshDepartments={refreshDepartments}
            />
        </Box>
    );
};

export default DepartmentManagement;
