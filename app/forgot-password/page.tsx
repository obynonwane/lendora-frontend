"use client";
import { useState } from "react";
import Link from "next/link";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { GiEnvelope } from "react-icons/gi";
import Image from "next/image";

import logoIcon from "../../images/logo-icon.png";
type StepState = "forgot-password" | "password-reset-email-sent";

function Page() {
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<StepState>("forgot-password");
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

  const sendPasswordResetEmailSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email Address is required"),
  });

  const sendPasswordResetEmail = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const formData = {
        email,
      };
      // validateinput
      await sendPasswordResetEmailSchema.validate(formData, {
        abortEarly: false,
      });

      // const response: unknown =
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/reset-password-email`,
        {
          email,
        }
      );
      // console.log(response.data);

      setIsLoading(false);
      setStep("password-reset-email-sent");

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

  return (
    <main className="flex justify-center md:h-screen items-center p-5 md:mt-0 mt-8 overflow-y-auto">
      {step === "forgot-password" && (
        <form
          className=" w-full md:w-[400px]"
          onSubmit={sendPasswordResetEmail}
        >
          {" "}
          <Link className=" " href="/">
            <Image
              src={logoIcon}
              alt="logo-icon"
              className="w-16 mx-auto mb-4"
            />
          </Link>
          <h2 className="mb-4 text-slate-900 text-xl font-semibold text-center">
            Forgot Password?
          </h2>
          <div className="mt-4 text-sm">
            <label className="mb-1 font-medium block text-slate-700">
              Email Address
            </label>
            <input
              className="border border-slate-400 py-4 px-4    w-full    rounded text-slate-700 hover:border-slate-900 outline-amber-500  "
              type="email"
              placeholder="user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={`flex w-full justify-center rounded py-4 bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-5 font-semibold ${
              isLoading ? "animate-pulse cursor-wait " : " opacity-100 "
            }`}
          >
            Send Email
          </button>
          <Link
            href="/login"
            className={` text-center block mt-4 text-sm text-orange-400  underline  `}
          >
            Back to Login
          </Link>
        </form>
      )}

      {step === "password-reset-email-sent" && (
        <div className="w-full md:w-[400px] pt-10 text-center">
          <p className="text-center  mb-2 ">
            <GiEnvelope className="text-6xl text-orange-400 mx-auto" />
          </p>
          <h2 className="mb-4 text-slate-900 text-xl font-semibold ">
            Email Sent!
          </h2>

          <p className="mb-1   text-slate-700">
            A password reset link has been sent to your email{" "}
            <span className="text-orange-400 font-medium underline">
              {" "}
              {email}
            </span>
            . Please check your inbox and follow the instructions to reset your
            password.
          </p>

          <Link
            href="/login"
            className={`flex w-full justify-center rounded bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-5 py-4 `}
          >
            Back to Login
          </Link>
        </div>
      )}
    </main>
  );
}

export default Page;
