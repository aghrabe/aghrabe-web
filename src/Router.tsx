import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
} from "react-router-dom";

import { useAuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./pages/Layout";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import Session from "./pages/Session/Session";
import NotFound from "./pages/NotFound";

function ProtectedRoute() {
    const { user } = useAuthContext();
    return user ? (
        <Layout>
            <Outlet />
        </Layout>
    ) : (
        <Navigate to={"/login"} replace />
    );
}

function RedirectToDashboard() {
    const { user } = useAuthContext();
    return <Navigate to={`/${user?.id}/dashboard`} replace />;
}

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path={"/"} element={<RedirectToDashboard />} />
                    <Route path={"/:id/dashboard"} element={<Dashboard />} />
                    <Route path={"/:id/session"} element={<Session />} />
                    <Route path={"/:id/settings"} element={<Settings />} />
                    <Route path={"/:id/stats"} element={<Stats />} />
                </Route>
                <Route path={"/login"} element={<Login />} />
                <Route path={"/register"} element={<Register />} />
                <Route path={"*"} element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
