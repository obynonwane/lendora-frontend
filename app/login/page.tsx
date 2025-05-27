"use client";
import { useState } from "react";
import Link from "next/link";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth-context";

import logoIcon from "../../images/logo-icon.png";
import { saveToLocalStorage } from "@/app/utility";
type StepState =
  | "login-form"
  | "unverified-email"
  | "resend-verification-email";

function Page() {
  const [email, setEmail] = useState("chibuikennaji306@gmail.com");
  const [password, setPassword] = useState("@Password2020");

  const { refreshAuth } = useAuth();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<StepState>("login-form");
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

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email Address is required"),
    password: yup.string().required("Please Enter your password"),
  });
  const resendVerificationEmailSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email Address is required"),
  });

  const login = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const formData = {
        email,
        password,
      };
      // validateinput
      await loginSchema.validate(formData, { abortEarly: false });

      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/login`,
        {
          email,
          password,
        }
      );

      const user = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/get-me`,
        {
          headers: {
            Authorization: `Bearer ${data.data.data.access_token}`,
          },
        }
      );

      saveToLocalStorage("lendora_user", user.data.data);
      saveToLocalStorage("lendora_ac_tk", data.data.data.access_token);
      setIsLoading(false);
      toast.success("sign-in successful!", toastOptions);
      refreshAuth(); // Call this before or after redirect

      router.push("/");
    } catch (errors: unknown) {
      if (errors instanceof yup.ValidationError) {
        console.log(errors);
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
        if (
          errors.response?.data?.message ===
          "email not verified, please verify your email"
        ) {
          setStep("unverified-email");
          setIsLoading(false);
        } else {
          toast.error("Incorrect credentials, try again", toastOptions);
        }

        setIsLoading(false);
      } else {
        // Handle all other errors
        toast.error("An unexpected error occurred.", toastOptions);
        setIsLoading(false);
      }
    }
  };

  const resendVerificationEmail = async (e: { preventDefault: () => void }) => {
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
      await resendVerificationEmailSchema.validate(formData, {
        abortEarly: false,
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/request-verification-email`,
        {
          email,
        }
      );
      // console.log(response.data);

      setIsLoading(false);
      setEmail("");
      toast.success("Email sent", toastOptions);

      // navigate("/dashboard");
    } catch (errors: unknown) {
      console.log(errors);
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
      {step === "login-form" && (
        <form className=" w-full md:w-[400px]" onSubmit={login}>
          <Link className=" " href="/">
            <Image
              src={logoIcon}
              alt="logo-icon"
              className="w-16 mx-auto mb-4"
            />
          </Link>
          <h2 className="mb-1 text-slate-900 text-xl font-semibold text-center">
            Welcome Back!
          </h2>
          <p className="text-center text-slate-700 mb-2">
            Enter your e-mail and password to log into you account.
          </p>
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

          <div className="mt-4 text-sm">
            <label className="mb-1 font-medium block text-slate-700">
              Password
            </label>
            <input
              className="border border-slate-400 py-4 px-4    w-full    rounded text-slate-700 hover:border-slate-900 outline-amber-500  "
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`flex w-full justify-center rounded font-semibold bg-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg shadow text-white mt-5 py-4 ${
              isLoading ? "animate-pulse cursor-wait " : " opacity-100 "
            }`}
          >
            Sign In
          </button>

          <p className="mt-5 text-center text-slate-700 text-sm ">
            Don&apos;t have an account?{" "}
            <Link className="text-orange-400 underline" href="/signup">
              Signup
            </Link>{" "}
          </p>

          <Link
            href="/forgot-password"
            className={` text-center block mt-4 text-orange-400 text-sm  underline  `}
          >
            Forgot Password?
          </Link>
        </form>
      )}

      {step === "unverified-email" && (
        <div className="w-full md:w-[400px]  text-center">
          <p className="text-center  mb-2">
            <FaEnvelope className="text-6xl text-zinc-300 mx-auto" />
          </p>
          <h2 className="mb-2 text-slate-900 text-xl font-semibold ">
            Unverified Email!
          </h2>

          <p className="mb-1   text-slate-700">
            Your email{" "}
            <span className="text-orange-400 font-medium underline">
              {" "}
              {email}
            </span>{" "}
            hasn&apos;t been verified yet. Please check your inbox and follow
            the confirmation link to activate your account.
          </p>

          <button
            onClick={() => setStep("login-form")}
            className={`flex w-full justify-center rounded bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-5 py-4 font-semibold `}
          >
            Back to Login
          </button>
          <button
            onClick={() => setStep("resend-verification-email")}
            className={`flex w-full justify-center rounded bg-zinc-700  text-white mt-5 py-4 font-semibold `}
          >
            Request Verification Email
          </button>
        </div>
      )}

      {step === "resend-verification-email" && (
        <form
          className="w-full md:w-[400px]"
          onSubmit={resendVerificationEmail}
        >
          <Link className=" " href="/">
            <Image
              src={logoIcon}
              alt="logo-icon"
              className="w-16 mx-auto mb-4"
            />
          </Link>
          <h2 className="mb-2 text-slate-900 text-xl text-center font-semibold ">
            Request Verification Email
          </h2>
          <p className="text-center text-slate-700 mb-2">
            Enter your e-mail and and recieve a link to change your password.
          </p>

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
            onClick={() => setStep("resend-verification-email")}
            className={`flex w-full justify-center rounded font-semibold bg-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg shadow text-white mt-5 py-4 ${
              isLoading ? "animate-pulse cursor-wait " : " opacity-100 "
            }`}
          >
            Send
          </button>
        </form>
      )}
    </main>
  );
}

export default Page;
