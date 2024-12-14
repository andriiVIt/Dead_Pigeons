import { RegisterRequest } from "../../Api.ts";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { http } from "../../http";
import NavBarAdmin from "/src/components/adminComponents/NavBarAdmin.tsx";

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
            const createPromise = http.authRegisterCreate(data);  
            toast.promise(createPromise, {
                loading: "Creating new player...",
                success: "Player created successfully! Verification email sent.",
                error: "Failed to create player. Please try again.",
            });

            await createPromise;  

             
            navigate("/admin/players");
        } catch (e: any) {
            setError(e.message);  
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
             
            <NavBarAdmin/>


             
            <div className="min-h-screen flex justify-center items-center  ">
                <div className="w-full max-w-3xl shadow-2xl bg-base-100 p-10 rounded-lg">
                    <h1 className="text-2xl font-bold text-center mb-6 text-black">
                        Registration of a New Player
                    </h1>
                    <form
                        className="space-y-6"
                        method="post"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Name field */}
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

                        {/* Email field */}
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

                        {/* Password field */}
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

                        {/* Repeat Password field */}
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

                        {/* Create button */}
                        <div className="form-control mt-6">
                            <button className="btn btn-primary w-full">Create</button>
                        </div>
                    </form>
                </div>
            </div>




        </div>
    );
}
