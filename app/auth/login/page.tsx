"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginMutation, useSnedOtpMutation } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
});

type LoginFormData = {
  email: string;
  password: string;
};

const LoginContent = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modal, setModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login, { isLoading }] = useLoginMutation();
  const [sendOtpApi, { isLoading: isSendingOtp }] = useSnedOtpMutation();

  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/auth/reset-password");
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await login(data).unwrap();

      if (res.status) {
        const user = res.data;
        const signInResult = await signIn("credentials", {
          id: user.id,
          email: user.email,
          name: user.name,
          token: res.token,
          redirect: false,
        });

        if (signInResult?.error) {
          toast.error("Gagal set session");
          return;
        }

        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.replace(callbackUrl);
      }
    } catch (error: any) {
      toast.error(error.data?.message || "An error occurred", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const modalResert = () => {
    setModal(!modal);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      return toast.error("Masukkan email terlebih dahulu!");
    }

    try {
      const res = await sendOtpApi({ email: resetEmail }).unwrap();

      if (res.status) {
        toast.success("OTP berhasil dikirim ke email!");
        setModal(false);
        router.push(`/auth/reset-password?email=${encodeURIComponent(resetEmail)}`);
      }
    } catch (error: any) {
      toast.error(error.data?.message.email || "Gagal mengirim OTP");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-sm w-full"
          noValidate
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Login
          </h1>

          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className={`bg-gray-50 border ${errors.email ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
              placeholder="name@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="••••••••"
              className={`bg-gray-50 border ${errors.password ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}

            <div className="flex justify-end my-3 text-sm">
              <button type="button" onClick={modalResert} className="text-blue-600 hover:underline dark:text-blue-400">
                Forget Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {modal && (
        <div className="w-full h-screen z-10 bg-black/50 backdrop-blur-sm fixed top-0 left-0 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Reset Password</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Masukkan email kamu untuk menerima kode OTP.
            </p>
            <form onSubmit={handleSendOtp}>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Email aktif kamu"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={modalResert}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSendingOtp ? "Mengirim..." : "Kirim OTP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;