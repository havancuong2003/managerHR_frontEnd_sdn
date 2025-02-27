export type User = {
    id: string;
    fullName: string;
    dob: string;
    gender: "Nam" | "Nữ";
    address: string;
    phone: string;
    department: string;
    position: string;
    salary: number;
    startDate: string;
    avatarUrl?: string;
    createdAt?: string;
    updatedAt?: string;
    role: "admin" | "user";
};
