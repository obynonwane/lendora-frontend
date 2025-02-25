"use client";
import { useState } from "react";
import Link from "next/link";
import * as yup from "yup";
// import { getFromLocalStorage, saveToLocalStorage } from "./utility";
import { toast } from "react-toastify";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";

import logoIcon from "../../images/logo-icon.png";

type SignupState = "signup-form" | "signup-success";
function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<SignupState>("signup-form");

  const toastOptions = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
  };

  const signupSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    phone: yup.string().required("Phone Number is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email Address is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters long")
      .required("Please Enter your password"),
  });

  const signup = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const formData = {
        firstName,
        lastName,
        phone,
        email,
        password,
      };
      // validateinput
      await signupSchema.validate(formData, { abortEarly: false });

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/signup`,
        {
          last_name: firstName,
          first_name: lastName,
          phone,
          email,
          password,
        }
      );
      //   console.log(response.data);
      setIsLoading(false);

      setStep("signup-success");

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
    <main className="flex justify-center md:h-screen items-center p-5 overflow-y-auto md:mt-0 mt-8">
      {step === "signup-form" && (
        <form className=" w-full md:w-[400px] md:mt-12" onSubmit={signup}>
          <Link className=" " href="/">
            <Image
              src={logoIcon}
              alt="logo-icon"
              className="w-16 mx-auto mb-4"
            />
          </Link>
          <h2 className="mb-1 text-slate-900 text-xl font-medium text-center">
            Welcome to Lendora!
          </h2>
          <p className="text-center text-slate-700 mb-2">
            Enter your details below to create an account .
          </p>

          <div className="grid grid-cols-12 gap-x-4">
            <div className="mt-4 text-sm md:col-span-6 col-span-12">
              <label className="mb-1 font-medium block text-slate-700">
                First Name
              </label>
              <input
                className="border border-slate-400 py-4 px-4    w-full    rounded text-slate-700 hover:border-slate-900 outline-amber-500  "
                type="text"
                placeholder=""
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mt-4 text-sm md:col-span-6 col-span-12">
              <label className="mb-1 font-medium block text-slate-700">
                Last Name
              </label>
              <input
                className="border border-slate-400 py-4 px-4    w-full    rounded text-slate-700 hover:border-slate-900 outline-amber-500  "
                type="text"
                placeholder=""
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

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
              Phone Number
            </label>
            <input
              className="border border-slate-400 py-4 px-4    w-full    rounded text-slate-700 hover:border-slate-900 outline-amber-500  "
              type="text"
              placeholder="080 9874 4948"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
          <p className="mt-4 text-center text-slate-700 text-xs ">
            By continuing you agree to Lendora&apos;s
            <Link className="text-[#F7972D] underline" href="/terms-conditions">
              {" "}
              Terms and Conditions
            </Link>{" "}
          </p>
          <button
            type="submit"
            className={`flex w-full justify-center rounded font-semibold bg-[#F7972D]  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-3 py-4 ${
              isLoading ? "animate-pulse cursor-wait " : " opacity-100 "
            }`}
          >
            Register
          </button>

          <p className="mt-5 text-center text-sm  text-slate-700 ">
            Got an account?{" "}
            <Link className="text-[#F7972D] underline" href="/login">
              Login
            </Link>{" "}
          </p>
        </form>
      )}

      {step === "signup-success" && (
        <div className="w-full md:w-[400px] pt-10 text-center">
          <p className="text-center  mb-2">
            <FaCheckCircle className="text-6xl text-[#F7972D] mx-auto" />
          </p>
          <h2 className="mb-2 text-slate-900 text-xl font-semibold ">
            Signup Successful!
          </h2>

          <p className="mb-1   text-slate-700">
            Your account has been successfully created! Please check your email
            <span className="text-[#F7972D] font-medium underline">
              {" "}
              {email}
            </span>{" "}
            to confirm your account and complete the setup.
          </p>

          {/* <Link href="/login"
            type="submit"
            className={`flex w-full justify-center rounded bg-[#F7972D]  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-5 py-2 ${
              isLoading
                ? "animate-pulse cursor-wait "
                : " opacity-100 "
            }`}
          >
            Register
          </Link> */}
        </div>
      )}
    </main>
  );
}

export default Page;
