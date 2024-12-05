import {Outlet} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import React from "react";
// import { Layout } from "./components/base/layout";

export default function Root() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">

            <div
                className="absolute w-96 h-96 bg-indigo-500 rounded-full opacity-20 bottom-10 right-10 blur-2xl animate-bounce"
            ></div>

            <Toaster
                toastOptions={{
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                }}
            />

            <Outlet/>

        </div>
    );
}
