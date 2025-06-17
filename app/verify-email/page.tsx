"use client";
import { useEffect, useState, use } from "react";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { BsFillEnvelopeSlashFill } from "react-icons/bs";
import { FaEnvelope } from "react-icons/fa";
import { useRouter } from "next/navigation";
type StepState =
  | "loading"
  | "email-token-expired"
  | "email-verified-successfully"
  | "resend-verification-email";

function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<StepState>("loading");
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

  const { token } = use(searchParams);

  const router = useRouter();

  const resendEmailSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email Address is required"),
  });

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
      await resendEmailSchema.validate(formData, { abortEarly: false });

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

      router.push("/login");
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

    const verifyEmail = async () => {
      try {
        setIsLoading(true);

        await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/verify-email?token=${token}`
        );
        // console.log(response.data);
        // setEmail("");
        setIsLoading(false);
        toast.success("Email Verified Succesfully!", toastOptions);

        router.push("/login");
      } catch (error: unknown) {
        console.log("there is n err");
        setIsLoading(false);

        if (axios.isAxiosError(error)) {
          if (error.response?.data?.status_code === 400) {
            setStep("email-token-expired");
          } else {
            toast.error("An unexpected error occurred.", toastOptions);
          }
        } else {
          // console.error("Non-Axios error:", error);
          toast.error("Something went wrong.", toastOptions);
        }
      }
    };
    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex justify-center flex-col  items-center p-5 ">
      {step === "loading" && (
        <div>
          <div className="relative text-center mt-12">
            <FaEnvelope className="animate-pulse text-orange-400 text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

            <svg
              className="w-12 h-12 mx-auto mb-2 text-gray-200 animate-spin dark:text-gray-300 fill-amber-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          <h2 className="mb-4 text-slate-900 text-xl font-semibold text-center">
            Verifying...
          </h2>
        </div>
      )}

      {step === "email-token-expired" && (
        <div className="w-full md:w-[400px] pt-10 text-center">
          <p className="text-center  mb-2">
            <BsFillEnvelopeSlashFill className="text-6xl text-red-200 mx-auto" />
          </p>
          <h2 className="mb-4 text-slate-900 text-2xl lg:text-3xl font-semibold ">
            Email Verification Expired
          </h2>

          <p className="mb-1   text-slate-700">
            Your email verification link has expired. Please request a new one
            to verify your account.
          </p>

          <button
            onClick={() => setStep("resend-verification-email")}
            className={`flex w-full justify-center rounded bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-5 py-4 ${
              isLoading ? "animate-pulse cursor-wait " : " opacity-100 "
            }`}
          >
            Re-send Verification Email
          </button>
        </div>
      )}

      {step === "resend-verification-email" && (
        <form
          className="w-full md:w-[400px] pt-10 "
          onSubmit={resendVerificationEmail}
        >
          <h2 className="mb-4 text-slate-900 text-2xl lg:text-3xl font-semibold ">
            Request Verification Email
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
            onClick={() => setStep("resend-verification-email")}
            className={`flex w-full justify-center rounded bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-5 py-4 ${
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
