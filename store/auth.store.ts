import { LoginSchema } from '@/schema/auth.schema';
import { authService } from '@/services/auth.service';
import { User } from '@/types/user.type';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    login: (values: LoginSchema) => Promise<boolean>;
    auth: () => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    login: async (user) => {
        const userRes = await authService.login(user);
        if (userRes && typeof userRes === 'string') {
            localStorage.setItem('token', userRes);
            return true;
        }
        return false;
    },
    auth: async () => {
        const user = await authService.checkAuth();
        if (!user) {
            set({ user: null });
            return false;
        }
        set({ user });
        return true;
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null })
    }
}));