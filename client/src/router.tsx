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

import ErrorPage from "/src/pages/drafts/error-page.tsx";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PlayerDashboard from "./pages/Player/PlayerDashboard"
import {ProtectedRoute} from "/src/components/ProtectedRoute.tsx";
import PlayersPage from "/src/pages/Admin/PlayersPage.tsx";
import GamePage from "/src/pages/Admin/GamePage.tsx";
import TransactionPage from "/src/pages/Admin/TransactionPage.tsx";
import GamesPage from "/src/pages/Player/GamesPage.tsx";
import BoardsPage from "/src/pages/Player/BoardsPage.tsx";

import TransactionsTable from "/src/pages/Player/TransactionsTable.tsx";
const router = createBrowserRouter(
    createRoutesFromElements(
        <> <Route path={'/'} element={<Root />} errorElement={<ErrorPage />} id={'root'}>
            <Route path="/" element={<HomePage />} errorElement={<ErrorPage />} />
            <Route path="/login" element={<Login />} errorElement={<ErrorPage />} />
            <Route element={<ProtectedRoute role="Admin" />}>
                <Route path="/admin" element={<AdminDashboard />} errorElement={<ErrorPage />} />
                <Route path="/admin/players" element={<PlayersPage />} />
                <Route path="/admin/games" element={<GamePage />} />
                <Route path="/admin/transactions" element={<TransactionPage />} />
                <Route path="/register-player" element={<Register />} />

            </Route>
            <Route element={<ProtectedRoute role="Player" />}>
                <Route path="/player" element={<PlayerDashboard />} errorElement={<ErrorPage />} />
                <Route path="/games" element={<GamesPage />} errorElement={<ErrorPage />} />
                <Route path="/boards" element={<BoardsPage />} errorElement={<ErrorPage />} />
                <Route path="/transactions" element={<TransactionsTable />} errorElement={<ErrorPage />} />

            </Route>
        </Route>
        </>
    ),
);

export default router;
