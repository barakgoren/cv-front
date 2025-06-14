import { LoginSchema } from "@/schema/auth.schema";
import http from "./http.service";
import { User } from "@/types/user.type";
import { toast } from '@/hooks/use-toast';

const BASE_URL = '/users';

const login = async (values: LoginSchema): Promise<string | null> => {
    const res = await http.post(`${BASE_URL}/login`, values);
    if (typeof res.data === 'string') {
        toast({
            title: 'Login successful',
            description: 'You have successfully logged in.',
        });
        return res.data
    }
    return null;
}
const checkAuth = async (): Promise<User | null> => {
    const res = await http.get(`${BASE_URL}/me`, { noError: true });
    if (res && res.data) {
        return serializeUser(res.data) as User;
    }
    return null;
}
const logout = async () => {
    await localStorage.removeItem('token');
    toast({
        title: 'Logout successful',
        description: 'You have successfully logged out.',
    });
    window.location.href = '/login';
}

function serializeUser(user: any): User {
    return {
        id: user.uid,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        username: user.username,
        role: user.permissions?.includes(2) ? 'Admin' : 'User',
        companyId: user.companyId,
    };
}

export const authService = {
    login,
    logout,
    checkAuth,
    // Add other authentication-related methods here
};