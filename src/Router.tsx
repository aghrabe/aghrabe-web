import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";

import { useEffect } from "react";
import { useAuthContext } from "./context/AuthContext";
import CheckEmail from "./pages/CheckEmail";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import LoadingPage from "./pages/LoadingPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Session from "./pages/Session";
import Settings from "./pages/Settings";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function ProtectedRoute() {
    const { user, isLoading } = useAuthContext();

    if (isLoading) {
        return <LoadingPage />;
    }

    return user ? (
        <Layout>
            <Outlet />
        </Layout>
    ) : (
        <Navigate to={"/login"} replace />
    );
}

function RedirectToDashboard() {
    const { user, isLoading } = useAuthContext();

    if (isLoading) {
        return <LoadingPage />;
    }

    return <Navigate to={`/${user?.id}/dashboard`} replace />;
}

export default function Router() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path={"/"} element={<RedirectToDashboard />} />
                    <Route path={"/:id/dashboard"} element={<Dashboard />} />
                    <Route path={"/:id/session"} element={<Session />} />
                    <Route path={"/:id/settings"} element={<Settings />} />
                </Route>
                <Route path={"/login"} element={<Login />} />
                <Route path={"/register"} element={<Register />} />
                <Route path={"/check-email"} element={<CheckEmail />} />
                <Route path={"*"} element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
