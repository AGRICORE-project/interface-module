export interface User {
    id: number;
    fullName: string;
    email: string;
    roles: string[];
    country: string;
    institution: string;
    verified: boolean;
    apiUrl: string | null;
}
