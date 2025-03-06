export interface ActivityLog {
    [key: string]: any;
    _id: string;
    userId: string;
    action: string;
    affected_userId: string | null;
    old_data: Record<string, any>;
    new_data: Record<string, any>;
    timestamp: string;
    roleName: string;
}
