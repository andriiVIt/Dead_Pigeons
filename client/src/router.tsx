import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    Routes,
} from "react-router-dom";
import Root from "./root";
// import Index, { indexLoader } from "./pages";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import RegisterSuccess from "./pages/auth/register-success";
import ErrorPage from "/src/pages/drafts/error-page.tsx";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PlayerDashboard from "./pages/Player/PlayerDashboard"
import {ProtectedRoute} from "/src/components/ProtectedRoute.tsx";
import PlayersPage from "/src/pages/Admin/PlayersPage.tsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<HomePage />} errorElement={<ErrorPage />} />
            <Route path="/login" element={<Login />} errorElement={<ErrorPage />} />
            <Route element={<ProtectedRoute role="Admin" />}>
                <Route path="/admin" element={<AdminDashboard />} errorElement={<ErrorPage />} />
                <Route path="/admin/players" element={<PlayersPage />} />
                <Route path="/register-player" element={<Register />} />
                {/*<Route path="/register-success" element={<RegisterSuccess />} />*/}
            </Route>
            <Route element={<ProtectedRoute role="Player" />}>
                <Route path="/player" element={<PlayerDashboard />} errorElement={<ErrorPage />} />


            </Route>
        </>
    ),
);

export default router;
