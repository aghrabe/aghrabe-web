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

function ProtectedRoute() {
    const { user } = useAuthContext();
    return user ? <Outlet /> : <Navigate to={"/login"} replace />;
}

function RedirectToDashboard() {
    const { user } = useAuthContext();
    return <Navigate to={`/dashboard/${user?.id}`} replace />;
}

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path={"/"} element={<RedirectToDashboard />} />
                    <Route path={"/dashboard/:id"} element={<Dashboard />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}
