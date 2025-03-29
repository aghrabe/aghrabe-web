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
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import LoadingPage from "./pages/LoadingPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Stats from "./pages/Stats";
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

function RedirectToHome() {
    const { user, isLoading } = useAuthContext();

    if (isLoading) {
        return <LoadingPage />;
    }

    return <Navigate to={`/${user?.id}/home`} replace />;
}

export default function Router() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path={"/"} element={<RedirectToHome />} />
                    <Route path={"/:id/home"} element={<Home />} />
                    <Route path={"/:id/stats"} element={<Stats />} />
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
