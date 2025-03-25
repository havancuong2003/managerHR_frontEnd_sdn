import React, { useState } from "react";
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface CreateLeaveRequestModalProps {
    open: boolean;
    handleClose: () => void;
    refreshLeaveRequests: () => void;
}

const CreateLeaveRequestModal: React.FC<CreateLeaveRequestModalProps> = ({
    open,
    handleClose,
    refreshLeaveRequests,
}) => {
    const { userId } = useSelector((state: RootState) => state.auth);
    const [leaveReason, setLeaveReason] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");

    const handleSubmit = async () => {
        try {
            await axios.post(
                "http://localhost:3000/api/leave_requests/create",
                {
                    id: userId,
                    leave_reason: leaveReason,
                    start_date: startDate,
                    end_date: endDate,
                },
                { withCredentials: true }
            );
            setSnackbarMessage("Tạo request nghỉ phép thành công!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            refreshLeaveRequests();
            handleClose();
        } catch (error) {
            setSnackbarMessage("Có lỗi xảy ra khi tạo request nghỉ phép.");
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
                    Tạo yêu cầu nghỉ phép
                </Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Lý do nghỉ</InputLabel>
                    <Select
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        label="Lý do nghỉ"
                    >
                        <MenuItem value="Nghỉ ốm">Nghỉ ốm</MenuItem>
                        <MenuItem value="Nghỉ phép">Nghỉ phép</MenuItem>
                        <MenuItem value="Nghỉ thai sản">Nghỉ thai sản</MenuItem>
                        <MenuItem value="Nghỉ cưới">Nghỉ cưới</MenuItem>
                        <MenuItem value="Nghỉ không lương">
                            Nghỉ không lương
                        </MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Ngày bắt đầu"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Ngày kết thúc"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
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

export default CreateLeaveRequestModal;
