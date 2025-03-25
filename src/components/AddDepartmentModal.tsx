import React, { useState } from "react";
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import axios from "axios";
import { AlertColor } from "@mui/material";

interface AddDepartmentModalProps {
    open: boolean;
    handleClose: () => void;
    refreshDepartments: () => void;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
    open,
    handleClose,
    refreshDepartments,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [snackbarSeverity, setSnackbarSeverity] =
        useState<AlertColor>("success");

    const handleSubmit = async () => {
        try {
            await axios.post(
                "http://localhost:3000/api/departments",
                {
                    name,
                    description,
                },
                { withCredentials: true }
            );
            setSnackbarMessage("Tạo phòng ban thành công!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            refreshDepartments();
            handleClose();
        } catch (error) {
            setSnackbarMessage("Có lỗi xảy ra khi tạo phòng ban.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

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
                    Tạo phòng ban mới
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
                    >
                        Tạo
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

export default AddDepartmentModal;
