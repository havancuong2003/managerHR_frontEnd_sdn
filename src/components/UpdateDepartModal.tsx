import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    AlertColor,
} from "@mui/material";
import axios from "axios";

interface UpdateDepartmentModalProps {
    open: boolean;
    handleClose: () => void;
    departmentId: string;
    initialName: string;
    initialDescription: string;
    refreshDepartments: () => void;
}

const UpdateDepartmentModal: React.FC<UpdateDepartmentModalProps> = ({
    open,
    handleClose,
    departmentId,
    initialName,
    initialDescription,
    refreshDepartments,
}) => {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] =
        useState<AlertColor>("success");

    useEffect(() => {
        if (open) {
            setName(initialName);
            setDescription(initialDescription);
        }
    }, [open, initialName, initialDescription]);

    const handleSubmit = async () => {
        try {
            await axios.put(
                `http://localhost:3000/api/departments/${departmentId}`,
                {
                    name,
                    description,
                },
                { withCredentials: true }
            );
            setSnackbarMessage("Cập nhật phòng ban thành công!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            refreshDepartments();
            handleClose();
        } catch (error) {
            setSnackbarMessage("Có lỗi xảy ra khi cập nhật phòng ban.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const isDisabled =
        name === initialName && description === initialDescription;

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2">
                    Cập nhật phòng ban
                </Typography>
                <TextField
                    fullWidth
                    label="Tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                />
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isDisabled}
                    >
                        Sửa
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                        style={{ marginLeft: "10px" }}
                    >
                        Hủy
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
            </Box>
        </Modal>
    );
};

export default UpdateDepartmentModal;
