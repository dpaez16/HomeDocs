import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./components/login/LoginPage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { UserSession } from "./types/userSession";
import { LoginSessionContext, type LoginSession } from "./context/LoginSessionContext";

export const App = () => {
    const { localStorageValue: userSession, setLocalStorageValue: setUserSession } = useLocalStorage<UserSession>('userSession');

    const loginSession: LoginSession = {
        userSession,
        updateUserSession: setUserSession,
        clearSession: () => setUserSession(null),
    };

    return (
        <Router>
            <LoginSessionContext.Provider value={loginSession}>
                <div className='app'>
                    <Routes>
                        <Route path='/' Component={LoginPage} />
                    </Routes>
                </div>
            </LoginSessionContext.Provider>
        </Router>
    );
};

export const AppNoSession = () => {
    return (
        <Router>
            <div className='app'>
                <Routes>
                    <Route path='/login' Component={LoginPage} />
                </Routes>
            </div>
        </Router>
    );
};
