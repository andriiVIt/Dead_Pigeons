import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import Root from "./root";
// import Index, { indexLoader } from "./pages";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import RegisterSuccess from "./pages/auth/register-success";
import ErrorPage from "/src/pages/drafts/error-page.tsx";



const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
            <Route index={true} element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-success" element={<RegisterSuccess />} />


        </Route>,
    ),
);

export default router;
