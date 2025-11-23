import { createContext } from 'react';
import type { UserSession } from '@/types/userSession';

export interface LoginSession {
    userSession: UserSession | null;
    updateUserSession: (data: UserSession) => void;
    clearSession: () => void;
}

export const LoginSessionContext = createContext<LoginSession>({
    userSession: null,
    updateUserSession: () => {},
    clearSession: () => {},
});
