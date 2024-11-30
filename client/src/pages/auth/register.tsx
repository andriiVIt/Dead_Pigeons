import { RegisterRequest } from "../../Api.ts";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { http } from "../../http";

type Inputs = RegisterRequest & { passwordRepeat: string };

const schema: yup.ObjectSchema<Inputs> = yup
    .object({
        name: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().min(6).required(),
        passwordRepeat: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required(),
    })
    .required();

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Оновлений onSubmit
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setError(null);
        try {
            const createPromise = http.authRegisterCreate(data); // Виконуємо запит для створення гравця
            toast.promise(createPromise, {
                loading: "Creating new player...",
                success: "Player created successfully! Verification email sent.",
                error: "Failed to create player. Please try again.",
            });

            await createPromise; // Чекаємо завершення запиту

            // Якщо успішно, перенаправляємо на сторінку /admin/players
            navigate("/admin/players");
        } catch (e: any) {
            setError(e.message); // У разі помилки встановлюємо текст помилки
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 flex items-center justify-center text-white relative overflow-hidden">
            {/* Анімації фону */}
            <div className="absolute w-72 h-72 bg-purple-400 rounded-full opacity-30 top-10 left-10 blur-xl animate-pulse"></div>
            <div className="absolute w-96 h-96 bg-indigo-500 rounded-full opacity-20 bottom-10 right-10 blur-2xl animate-bounce"></div>

            {/* Контейнер для форми */}
            <div className="hero z-10">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="card shrink-0 w-full max-w-lg shadow-2xl bg-base-100 p-8">
                        <h1 className="text-2xl font-bold text-center mb-6 text-black">
                            Registration of a New Player
                        </h1>
                        <form
                            className="card-body"
                            method="post"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            {/* Поле Name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-black">Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className={`input input-bordered text-black ${
                                        errors.name ? "input-error" : ""
                                    }`}
                                    {...register("name")}
                                />
                                <small className="text-error">{errors.name?.message}</small>
                            </div>

                            {/* Поле Email */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-black">Email</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className={`input input-bordered text-black ${
                                        errors.email ? "input-error" : ""
                                    }`}
                                    {...register("email")}
                                />
                                <small className="text-error">{errors.email?.message}</small>
                            </div>

                            {/* Поле Password */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-black">Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={`input input-bordered text-black ${
                                        errors.password ? "input-error" : ""
                                    }`}
                                    {...register("password")}
                                />
                                <small className="text-error">{errors.password?.message}</small>
                            </div>

                            {/* Поле Repeat Password */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-black">Repeat password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Repeat password"
                                    className={`input input-bordered text-black ${
                                        errors.passwordRepeat ? "input-error" : ""
                                    }`}
                                    {...register("passwordRepeat")}
                                />
                                <small className="text-error">
                                    {errors.passwordRepeat?.message}
                                </small>
                            </div>

                            {/* Кнопка Create */}
                            <div className="form-control mt-6">
                                <button className="btn btn-primary w-full">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Декоративні SVG */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <svg
                    className="absolute top-20 left-20 w-64 h-64 text-yellow-300 opacity-50 animate-spin-slow"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                >
                    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="4"></circle>
                </svg>
                <svg
                    className="absolute bottom-20 right-20 w-64 h-64 text-pink-300 opacity-50 animate-spin-reverse"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                >
                    <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="4"></circle>
                </svg>
            </div>
        </div>
    );
}
