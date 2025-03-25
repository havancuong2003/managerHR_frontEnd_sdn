import React, { useEffect, useState } from "react";
import { ActivityLog } from "../models/activity_logs";
import {
    downloadActivityLogs,
    getActivityLogs,
} from "../services/commons/activity_log.service";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { date } from "zod";
import { toast, ToastContainer } from "react-toastify";

const ActivityLogTable: React.FC = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [sortedLogs, setSortedLogs] = useState<ActivityLog[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [sortKey, setSortKey] = useState<string>("timestamp");
    const [isDescending, setIsDescending] = useState<boolean>(false);
    // const [error, toast.error] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Fetch logs from the API
    const fetchLogs = async () => {
        try {
            const response = await getActivityLogs();
            setLogs(response);
            setSortedLogs(response);
        } catch (err) {
            toast.error("Failed to fetch logs.");
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    // Handle sorting by key
    const handleSort = (key: string) => {
        let sorted: ActivityLog[] = [];

        sorted = [...sortedLogs].sort((a, b) => {
            let valueA = a[key as keyof ActivityLog],
                valueB = b[key as keyof ActivityLog];

            // Kiểm tra nếu key là 'timestamp' hoặc trường thời gian
            if (key === "timestamp") {
                // Split the timestamp string into date and time components
                const [dateA, timeA] = valueA.split(", ");
                const [dateB, timeB] = valueB.split(", ");

                // Convert date from DD/MM/YYYY to YYYY/MM/DD for correct comparison
                const [dayA, monthA, yearA] = dateA.split("/");
                const [dayB, monthB, yearB] = dateB.split("/");
                const formattedDateA = `${yearA}-${monthA}-${dayA} ${timeA}`;
                const formattedDateB = `${yearB}-${monthB}-${dayB} ${timeB}`;

                // Compare both dates
                const timeAParsed = new Date(formattedDateA).getTime();
                const timeBParsed = new Date(formattedDateB).getTime();

                return isDescending
                    ? timeAParsed - timeBParsed
                    : timeBParsed - timeAParsed;
            } else if (
                key === "userPhone" ||
                key === "affected_userPhone" ||
                key === "action" ||
                key === "roleName"
            ) {
                // Kiểm tra nếu key là các trường chuỗi
                valueA = a[key];
                valueB = b[key];
            }

            // Kiểm tra nếu valueA và valueB là chuỗi, thì sắp xếp theo từ điển
            if (typeof valueA === "string" && typeof valueB === "string") {
                if (isDescending) {
                    return valueB > valueA ? 1 : valueB < valueA ? -1 : 0; // Descending order
                } else {
                    return valueA > valueB ? 1 : valueA < valueB ? -1 : 0; // Ascending order
                }
            } else {
                // Nếu là số, sắp xếp theo giá trị số học
                return isDescending
                    ? valueA - valueB // Sắp xếp giảm dần
                    : valueB - valueA; // Sắp xếp tăng dần
            }
        });

        setSortedLogs(sorted);
        setSortKey(key);
    };

    // Handle search
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        const filteredLogs = logs.filter(
            (log) =>
                log.userPhone.includes(value) ||
                log.action.includes(value) ||
                log.timestamp.includes(value) ||
                log.affected_userPhone.includes(value)
        );
        setSortedLogs(filteredLogs);
    };

    // Validate start and end dates
    const handleDateValidation = (): boolean => {
        const currentDate = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (!startDate || !endDate) {
            toast;
            toast.error("Both dates are required.");
            return false;
        }

        if (start > currentDate) {
            toast.error("Start date cannot be in the future.");
            return false;
        }

        if (end > currentDate) {
            toast.error("End date cannot be in the future.");
            return false;
        }

        if (
            start < new Date(currentDate.setMonth(currentDate.getMonth() - 2))
        ) {
            toast.error("Start date cannot be more than 2 months ago.");
            return false;
        }

        // New validation: Ensure end date is not earlier than start date
        if (end < start) {
            toast.error("End date cannot be earlier than start date.");
            return false;
        }

        return true;
    };

    // Handle download of activity logs
    const handleDownload = async () => {
        if (!handleDateValidation()) return;

        const data = {
            startDate,
            endDate,
        };

        const response = await downloadActivityLogs(data);
        if (!response) return;

        // Check if response.data is a valid Blob
        if (response && response.data instanceof Blob) {
            // Create a blob from the response data
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Create a download link
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "employees_backup.xlsx"; // Use the appropriate filename
            link.click();
        } else {
            console.error("Failed to download file, invalid response.");
        }
    };
    const formatData = (data: any) => {
        if (!data) return "null"; // Handle case where there's no data

        const formattedData = Object.keys(data).map((key) => {
            return `${key}: ${data[key]}`; // Format as key: value
        });

        return formattedData.join("<br />"); // Join with <br /> for line breaks
    };

    const handleTongleSort = () => {
        console.log("â");

        setIsDescending(!isDescending);
        handleSort(sortKey);
    };

    console.log("check isDescending", isDescending);

    return (
        <div className="container-fluid mt-5 mr-5">
            <div className="flex mb-4 items-center">
                <div className="flex space-x-4">
                    <div>
                        <label className="mr-2">Ngày bắt đầu:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2"
                        />
                    </div>
                    <div>
                        <label className="mr-2">Ngày kết thúc:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2"
                        />
                    </div>
                </div>
                <div className="flex space-x-4 ml-4">
                    <button
                        onClick={handleDownload}
                        className="bg-green-500 text-white p-2 rounded w-[100px]"
                    >
                        Tải xuống
                    </button>
                    <button
                        onClick={fetchLogs} // Refresh API
                        className="bg-blue-500 text-white p-2 rounded w-[100px]"
                    >
                        Tải lại
                    </button>
                </div>
            </div>

            <div className="mb-4 flex">
                <div className="mb-4 mr-2">
                    <label className="mr-2">Tìm kiếm :</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border p-2 w-[400px]"
                        placeholder="Nhập số điện thoại / ngày / hành động"
                    />
                </div>

                <ToastContainer />
                <div className="mb-4">
                    <label className="mr-2">Sort by:</label>
                    <select
                        value={sortKey}
                        onChange={(e) => handleSort(e.target.value)}
                        className="border p-2"
                    >
                        <option value="timestamp">Thời gian</option>
                        <option value="action">Hành Động</option>
                        <option value="userPhone">
                            Số điện thoại người dùng{" "}
                        </option>
                        <option value="affected_userPhone">
                            Điện thoại người dùng bị ảnh hưởng
                        </option>
                        <option value="roleName">Vai trò</option>
                    </select>
                    <button
                        onClick={handleTongleSort} // Toggle sort order
                        className="ml-2 bg-gray-500 text-white p-2 rounded"
                    >
                        {isDescending ? "Tăng dần" : "Giảm dần"}
                    </button>
                </div>
            </div>

            <TableContainer
                component={Paper}
                sx={{ maxHeight: 600, overflowY: "auto" }}
            >
                <Table
                    sx={{
                        minWidth: 850,
                        tableLayout: "fixed",
                        borderCollapse: "collapse",
                    }}
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{ width: 100, border: "1px solid #ccc" }}
                            >
                                Thời Gian
                            </TableCell>
                            <TableCell
                                sx={{ width: 100, border: "1px solid #ccc" }}
                            >
                                Hành Động
                            </TableCell>
                            <TableCell
                                sx={{ width: 100, border: "1px solid #ccc" }}
                            >
                                Số điện thoại người dùng
                            </TableCell>
                            <TableCell
                                sx={{ width: 100, border: "1px solid #ccc" }}
                            >
                                Số điện thoại người bị tác động
                            </TableCell>
                            <TableCell
                                sx={{ width: 400, border: "1px solid #ccc" }}
                            >
                                Dữ liệu trước hành động
                            </TableCell>
                            <TableCell
                                sx={{ width: 400, border: "1px solid #ccc" }}
                            >
                                Dữ liệu sau hành động
                            </TableCell>
                            <TableCell
                                sx={{ width: 100, border: "1px solid #ccc" }}
                            >
                                Vai trò
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedLogs.map((log) => (
                            <TableRow key={log._id}>
                                <TableCell
                                    sx={{
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                        border: "1px solid #ccc",
                                    }}
                                >
                                    {log.timestamp}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                        border: "1px solid #ccc",
                                    }}
                                >
                                    {log.action}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                        border: "1px solid #ccc",
                                    }}
                                >
                                    {log.userPhone}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                        border: "1px solid #ccc",
                                    }}
                                >
                                    {log.affected_userPhone}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                        border: "1px solid #ccc",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: formatData(log.old_data),
                                    }}
                                />
                                <TableCell
                                    sx={{
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                        border: "1px solid #ccc",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: formatData(log.new_data),
                                    }}
                                />
                                <TableCell
                                    sx={{
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                        border: "1px solid #ccc",
                                    }}
                                >
                                    {log.roleName}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ActivityLogTable;
