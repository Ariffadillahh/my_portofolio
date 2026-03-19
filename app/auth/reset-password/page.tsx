"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useResetPasswordMutation } from "../../services/auth.service";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

const resetSchema = yup.object().shape({
    email: yup
        .string()
        .email("Gunakan format email yang valid")
        .required("Email wajib diisi"),
    password: yup
        .string()
        .min(4, "Password minimal 4 karakter")
        .required("Password baru wajib diisi"),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref("password")], "Password konfirmasi tidak cocok")
        .required("Konfirmasi password wajib diisi"),
    token: yup
        .string()
        .required("Kode OTP wajib diisi"),
});

type ResetFormData = {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
};

const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailQuery = searchParams.get("email") || "";
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ResetFormData>({
        resolver: yupResolver(resetSchema),
        defaultValues: {
            email: emailQuery,
            password: "",
            password_confirmation: "",
            token: "",
        },
    });

    useEffect(() => {
        if (!emailQuery) {
            toast.error("Akses tidak valid. Silakan mulai ulang dari lupa password.");
            router.replace("/auth/login"); 
        } else {
            setValue("email", emailQuery);
        }
    }, [emailQuery, setValue, router]);

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const onSubmit = async (data: ResetFormData) => {
        try {
            const res = await resetPassword(data).unwrap();

            if (res.status) {
                toast.success("Password berhasil direset! Silakan login.");
                setTimeout(() => {
                    router.push("/auth/login");
                }, 1500);
            }
        } catch (error: any) {
            toast.error(error.data?.message || "Gagal mereset password", {
                duration: 3000,
                position: "top-right",
            });
        }
    };

    if (!emailQuery) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Redirecting...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-5">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-sm w-full"
                noValidate
            >
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                    Reset Password
                </h1>

                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        readOnly
                        {...register("email")}
                        className="bg-gray-200 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="token" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Kode OTP
                    </label>
                    <input
                        type="text"
                        id="token"
                        {...register("token")}
                        placeholder="Masukkan OTP dari email"
                        className={`bg-gray-50 border ${errors.token ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                    />
                    {errors.token && <p className="mt-1 text-sm text-red-500">{errors.token.message}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Password Baru
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            {...register("password")}
                            placeholder="••••••••"
                            className={`bg-gray-50 border ${errors.password ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="password_confirmation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="password_confirmation"
                            {...register("password_confirmation")}
                            placeholder="••••••••"
                            className={`bg-gray-50 border ${errors.password_confirmation ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="mt-1 text-sm text-red-500">{errors.password_confirmation.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? "Memproses..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

const ResetPasswordPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
};

export default ResetPasswordPage;