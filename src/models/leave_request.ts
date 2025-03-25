export interface LeaveRequest {
    _id: string;
    employeeId: string;
    leave_reason: string;
    start_date: string;
    end_date: string;
    status: string;
    manager_reason: string;
}
