import { createRoot } from 'react-dom/client';
import './index.css';
import { App, AppNoSession } from './App.tsx';
import { getLocalStorageObject, removeLocalStorageItem } from './utils/localStorage.ts';
import type { UserSession } from './types/userSession.ts';
import { loginSessionHandshake } from './api/loginSession.ts';

const main = async () => {
    const rootElem = document.getElementById('root');
    if (!rootElem) {
        return null;
    }

    const root = createRoot(rootElem);

    if (document.location.pathname === '/login') {
        root.render(
            <AppNoSession />
        );
        return;
    }

    const userSession = getLocalStorageObject<UserSession>('userSession');
    const isValid = await loginSessionHandshake(userSession?.jwt ?? null);

    if (!isValid) {
        removeLocalStorageItem('userSession');
        if (document.location.pathname !== '/login') {
            document.location.href = '/login';
        }
    }

    root.render(
        <App />
    );
};

main().catch(err => {
    console.log(err);
    document.location.href = '/login';
});
