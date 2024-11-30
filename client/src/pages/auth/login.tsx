import { Credentials, useAuth } from "../../atoms/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

const schema: yup.ObjectSchema<Credentials> = yup
    .object({
        email: yup.string().email().required(),
        password: yup.string().min(6).required(),
    })
    .required();

export default function Login() {
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit: SubmitHandler<Credentials> = (data) => {
        toast.promise(login(data), {
            success: "Logged in successfully",
            error: "Invalid credentials",
            loading: "Logging in...",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-700 to-pink-500 flex items-center justify-center text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500 rounded-full opacity-30 blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500 rounded-full opacity-30 blur-2xl animate-bounce"></div>

            <div className="card w-full max-w-md shadow-2xl bg-opacity-90 bg-white z-10 p-8 rounded-lg">
                <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Welcome Back</h1>
                <p className="text-center text-gray-600 mb-8">Sign in to continue</p>
                <form method="post" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control mb-4">
                        <label className="label text-gray-700 font-medium">
                            <span>Email</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your email"
                            className={`input input-bordered w-full text-black ${
                                errors.email && "input-error"
                            }`}
                            {...register("email")}
                        />
                        <small className="text-error">{errors.email?.message}</small>
                    </div>
                    <div className="form-control mb-4">
                        <label className="label text-gray-700 font-medium">
                            <span>Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className={`input input-bordered w-full text-black ${
                                errors.password && "input-error"
                            }`}
                            {...register("password")}
                        />
                        <small className="text-error">{errors.password?.message}</small>
                    </div>
                    <div className="form-control flex items-center justify-between mb-6">
                        <a href="#" className="text-sm link link-hover text-purple-600">
                            Forgot password?
                        </a>
                    </div>
                    <div className="form-control">
                        <button
                            className="btn btn-primary w-full shadow-lg hover:shadow-xl transform transition-transform hover:scale-105">
                            Login
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?

                </p>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Contact the administrator.
                </p>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <svg className="absolute top-32 left-20 w-64 h-64 text-purple-400 opacity-20 animate-spin-slow" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="4"></circle>
                </svg>
                <svg className="absolute bottom-32 right-20 w-64 h-64 text-indigo-400 opacity-20 animate-spin-reverse" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="4"></circle>
                </svg>
            </div>
        </div>
    );
}
