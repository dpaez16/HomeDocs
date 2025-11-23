import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./components/login/LoginPage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { UserSession } from "./types/userSession";
import { LoginSessionContext, type LoginSession } from "./context/LoginSessionContext";
import { Layout } from "./components/sidebar/layout";

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
                <Layout>
                    <div className='p-4'>
                        <Routes>
                            <Route path='/' Component={LoginPage} />
                        </Routes>
                    </div>
                </Layout>
            </LoginSessionContext.Provider>
        </Router>
    );
};

export const AppNoSession = () => {
    return (
        <Router>
            <div className='flex justify-center items-center min-h-screen w-screen'>
                <Routes>
                    <Route path='/login' Component={LoginPage} />
                </Routes>
            </div>
        </Router>
    );
};
