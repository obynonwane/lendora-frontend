"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import * as yup from "yup";
// import { getFromLocalStorage, saveToLocalStorage } from "./utility";
import { toast } from "react-toastify";
import axios from "axios";
import { BsFillEnvelopeSlashFill } from "react-icons/bs";
import { useRouter, useSearchParams } from "next/navigation";
type StepState = "reset-password" | "password-reset-successfully";

function Page() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<StepState>("reset-password");
  // login-form
  // unverified-email
  const toastOptions = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
  };

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();

  const resetPasswordSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters long")
      .required("Please Enter your new password"),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm new password is required"),
  });

  const resetPassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const formData = {
        password,
        confirmPassword,
      };
      // validateinput
      await resetPasswordSchema.validate(formData, { abortEarly: false });

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/change-password`,
        {
          password,
          confirm_password: confirmPassword,
          token,
        }
      );

      setIsLoading(false);

      setStep("password-reset-successfully");
      // navigate("/dashboard");
    } catch (errors: unknown) {
      if (errors instanceof yup.ValidationError) {
        // Handle Yup validation errors
        const validationErrors: Record<string, string> = {};
        const error = errors.inner[0];

        if (error && error.path) {
          // Ensure error.path is defined before using it as an index
          validationErrors[error.path] = error.message;

          // Display the first error
          toast.error(error.message, toastOptions);
        } else {
          toast.error("An unknown validation error occurred.", toastOptions);
        }

        setIsLoading(false);
      } else if (axios.isAxiosError(errors)) {
        // Handle Axios errors
        if (errors.response?.data?.message) {
          toast.error(errors.response.data.message, toastOptions);
        } else {
          toast.error("An unknown error occurred.", toastOptions);
        }

        setIsLoading(false);
      } else {
        // Handle all other errors
        toast.error("An unexpected error occurred.", toastOptions);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!token) {
      return router.push("/login");
    }
  }, [token, router]);

  return (
    <main className="flex justify-center flex-col md:h-screen items-center p-5 overflow-y-auto">
      {step === "password-reset-successfully" && (
        <div className="w-full md:w-[400px] pt-10 text-center">
          <p className="text-center  mb-2">
            <BsFillEnvelopeSlashFill className="text-6xl text-red-200 mx-auto" />
          </p>
          <h2 className="mb-1 text-slate-900 text-2xl lg:text-3xl font-semibold ">
            Password Reset Successful!
          </h2>

          <p className="mb-1   text-slate-700">
            Your password has been reset successfully. You can now log in with
            your new password.
          </p>

          <Link
            href="/login"
            className={`flex w-full justify-center rounded bg-[#F7972D]  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-5 py-2`}
          >
            Login
          </Link>
        </div>
      )}

      {step === "reset-password" && (
        <form className="w-full md:w-[400px] pt-10 " onSubmit={resetPassword}>
          <h2 className="mb-4 text-slate-900 text-2xl lg:text-3xl font-semibold ">
            Reset Your Password
          </h2>

          <div className="mt-4 text-sm">
            <label className="mb-1 font-medium block text-slate-700">
              New Password
            </label>
            <input
              className="border border-slate-400 py-4 px-4    w-full    rounded text-slate-700 hover:border-slate-900 outline-amber-500  "
              type="password"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-4 text-sm">
            <label className="mb-1 font-medium block text-slate-700">
              Confirm New Password
            </label>
            <input
              className="border border-slate-400 py-4 px-4    w-full    rounded text-slate-700 hover:border-slate-900 outline-amber-500  "
              type="password"
              placeholder="*********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`flex w-full justify-center rounded bg-[#F7972D]  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-5 py-2 ${
              isLoading ? "animate-pulse cursor-wait " : " opacity-100 "
            }`}
          >
            Reset Password
          </button>
        </form>
      )}
    </main>
  );
}

export default Page;
