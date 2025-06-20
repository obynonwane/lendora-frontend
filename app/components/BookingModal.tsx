import React, { useState } from "react";
import axios from "axios";
import { RiCloseLine } from "react-icons/ri";
import { ProductPageProduct } from "@/app/types";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaPhoneVolume } from "react-icons/fa";
import * as yup from "yup";
import { toast } from "react-toastify";
import { structureRentalDuration } from "@/app/utils/structureRentalDuration";
import { calculateReturnDate } from "@/app/utils/calculateReturnDate";
import { useRouter, usePathname } from "next/navigation";
import { UserData_TYPE } from "@/app/types";
import { getFromLocalStorage } from "../utils/utility";
import { useUserStore } from "../utils/useUserStore";

type Props = {
  //   selectedState: State | null;
  //   setSelectedState: (value: State | null) => void;
  quantity: number;
  product: ProductPageProduct;
  handleIncrementQuantity: () => void;
  handleDecrementQuantity: () => void;

  setIsShowBookingModal: (value: boolean) => void;
};

export default function BookingModal({
  handleIncrementQuantity,
  handleDecrementQuantity,
  quantity,
  setIsShowBookingModal,
  product,
}: Props) {
  const [step, setStep] = useState<number>(1);
  const router = useRouter();
  const userData: UserData_TYPE | null = getFromLocalStorage("lendora_user");

  const formatNumber = (value: string): string => {
    const num = value.replace(/\D/g, ""); // Remove non-numeric characters
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
  };
  const toastOptions = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
  };

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const authStateLoaded = useUserStore((s) => s.authStateLoaded);

  const [isLoading, setIsLoading] = useState(false);

  // const calculateSubtotal = ()=>{

  // }
  const handleAmountChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const rawValue = e.target.value;
      setter(formatNumber(rawValue));
    };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // returns YYYY-MM-DD
  };

  const [rentalDuration, setRentalDuration] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  // const [pickupDate, setPickupDate] = useState(getTodayDate());
  const [isNegotiate, setIsNegotiate] = useState(false);

  const duration = Number(rentalDuration.replace(/,/g, ""));
  const pricePerUnit = isNegotiate
    ? Number(offerAmount.replace(/,/g, ""))
    : Number(product.inventory.offer_price);
  const total =
    duration * quantity * pricePerUnit + product.inventory.security_deposit;

  const handleStep1 = async () => {
    const validationSchema = yup.object().shape({
      rentalDuration: yup
        .string()
        .required("Rental Duration is required")
        .test(
          "is-valid-rentalDuration",
          "Rental Duration must be a valid number",
          (value) => {
            if (!value) return false;
            const numericValue = value.replace(/,/g, "");
            return !isNaN(Number(numericValue)) && Number(numericValue) > 0;
          }
        ),
      pickupDate: yup
        .string()
        .required("Date is required")
        .test("is-valid-date", "Date cannot be in the past", function (value) {
          if (!value) return false;
          const selected = new Date(value);
          const today = new Date();
          // Clear time for accurate date-only comparison
          selected.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          return selected >= today;
        }),
      isNegotiate: yup.boolean(),

      offerAmount: yup.string().when("isNegotiate", {
        is: true,
        then: (schema) =>
          schema
            .required("Offer Amount is required")
            .test(
              "is-valid-minimumNegotiatableAmount",
              "Offer Amount must be above ₦" +
                product.inventory.minimum_price.toLocaleString(),
              (value) => {
                if (!value) return false;
                const numericValue = value.replace(/,/g, "");
                return (
                  !isNaN(Number(numericValue)) &&
                  Number(numericValue) > Number(product.inventory.minimum_price)
                );
              }
            ),
        otherwise: (schema) => schema.notRequired(),
      }),
    });

    const data = {
      rentalDuration,
      pickupDate,
      isNegotiate,
      offerAmount,
    };

    try {
      await validationSchema.validate(data, {
        abortEarly: false,
      });
      setStep(2);
      // console.log("good to go");
    } catch (errors: unknown) {
      if (errors instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        const error = errors.inner[0];

        if (error?.path && error?.message) {
          validationErrors[error.path] = error.message;
          toast.error(error.message, toastOptions);
        }

        // setIsLoading(false);
      } else {
        console.error(errors);
        // setIsLoading(false);
      }
    }
  };
  const handleStep2 = async () => {
    const now = new Date();
    const end_time = now.toTimeString().slice(0, 5);

    const data = {
      inventory_id: product.inventory.id,
      rental_type: product.inventory.rental_duration,
      rental_duration: Number(rentalDuration.replace(/,/g, "")),
      security_deposit: product.inventory.security_deposit,
      offer_price_per_unit: isNegotiate
        ? Number(offerAmount.replace(/,/g, ""))
        : product.inventory.offer_price,
      quantity: quantity,
      start_date: pickupDate,
      end_date: calculateReturnDate(
        pickupDate,
        product.inventory.rental_duration,
        Number(rentalDuration.replace(/,/g, ""))
      ),
      end_time: end_time,
      total_amount: total,
    };
    // console.log(data);
    try {
      setIsLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/booking/create-booking`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userData?.access_token}`,
          },
        }
      );
      setIsLoading(false);
      // await refetchUser();
      setStep(3);
      setIsLoading(false);
      toast.success(" successful!", toastOptions);
      // refreshAuth();

      //   router.push("/");
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
          setIsLoading(false);
        } else {
          toast.error("An unknown validation error occurred.", toastOptions);
          setIsLoading(false);
        }

        setIsLoading(false);
      } else if (axios.isAxiosError(errors)) {
        // Handle Axios errors
        if (errors.response?.data?.message === "Unauthorized") {
          router.push("/login");
        }

        setIsLoading(false);
      } else {
        // Handle all other errors
        toast.error("An unexpected error occurred.", toastOptions);

        setIsLoading(false);
      }
    }

    // console.log(data);
  };
  const pathname = usePathname();

  if (!authStateLoaded || !isAuthenticated) {
    return (
      <div className="flex z-[50] fixed lendora-modal inset-0 items-center pt-10 bg-black/50">
        <div className="bg-white relative   overflow-x-hidden rounded-md m-auto md:w-[400px]  w-[90%]  h-fit">
          <h3 className="text-xl  px-5 pt-4 text-center font-medium text-slate-900 ">
            Login to Book!
          </h3>

          <RiCloseLine
            onClick={() => {
              setIsShowBookingModal(false);
            }}
            className="text-xl cursor-pointer absolute top-2 right-2"
          />

          <div className="px-5 pb-5">
            <p className="text-center text-gray-700">
              Please log in to complete your booking.
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  router.push(`/login?redirect=${pathname}`); // Redirect to login page
                }}
                className="bg-orange-400 hover:bg-[#FFAB4E] text-white font-semibold py-2 px-4 rounded"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex z-[50] fixed lendora-modal inset-0 items-center pt-10 bg-black/50">
        <div className="bg-white  flex flex-col  overflow-x-hidden rounded-md m-auto md:w-[500px]  w-[90%]  h-fit">
          {step !== 3 && (
            <h3 className="text-base flex px-5 pt-4 justify-between items-center font-medium text-slate-900 mb-2">
              Complete Booking
              <span
                onClick={() => {
                  setIsShowBookingModal(false);
                }}
              >
                <RiCloseLine className="text-xl cursor-pointer" />
              </span>
            </h3>
          )}
          {step === 1 && (
            <>
              <div className="grid grid-cols-12 gap-3 p-5 overflow-y-auto h-full">
                <div className="col-span-12 lg:col-span-6">
                  <label
                    htmlFor="title"
                    className="mb-2 mt-2 flex w-full justify-between items-center"
                  >
                    <span>
                      Rental Duration ({product.inventory.rental_duration})
                    </span>
                  </label>
                  <input
                    type="text"
                    value={rentalDuration}
                    className="border border-slate-300 px-2 py-3 rounded w-full"
                    // className="currency-input appearance-none border-r border-y rounded-r-md  w-full py-3 px-3 bg-white text-gray-500 leading-tight focus:outline-none"
                    placeholder="Rental Duration"
                    onInput={handleAmountChange(setRentalDuration)}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <label
                    htmlFor="title"
                    className="mb-2 mt-2 flex w-full justify-between items-center"
                  >
                    <span>Start Date</span>
                  </label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    value={pickupDate}
                    className="border border-slate-300 px-2 py-3 rounded w-full"
                    // className="currency-input appearance-none border-r border-y rounded-r-md  w-full py-3 px-3 bg-white text-gray-500 leading-tight focus:outline-none"
                    placeholder="Pick-up Date"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPickupDate(e.target.value)
                    }
                  />
                </div>

                <div className="col-span-12 my-3 flex flex-col items-center justify-center gap-5 rounded bg-slate-950 p-3 text-sm text-white shadow-md md:flex-row md:justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400 text-xl">✨</span>
                    <span className="font-medium">
                      Want to negotiate the price?
                    </span>
                  </div>
                  <button
                    onClick={() => setIsNegotiate(!isNegotiate)}
                    className="transition duration-200 ease-in-out hover:bg-orange-500 rounded bg-orange-400 px-4 py-2 font-semibold text-white"
                  >
                    Make an offer!
                  </button>
                </div>

                {isNegotiate && (
                  <div className="col-span-12 -mt-2">
                    <label
                      htmlFor="title"
                      className="mb-2 flex w-full justify-between items-center"
                    >
                      <span>Offer Amount</span>
                    </label>
                    <input
                      type="text"
                      value={offerAmount}
                      className="border border-slate-300 px-2 py-3 rounded w-full"
                      // className="currency-input appearance-none border-r border-y rounded-r-md  w-full py-3 px-3 bg-white text-gray-500 leading-tight focus:outline-none"
                      placeholder="Offer Amount"
                      onInput={handleAmountChange(setOfferAmount)}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-stretch col-span-12 mt-5 p-3">
                <div className="bg-slate-100 flex rounded flex-1  px-2 items-center gap-3 justify-between  ">
                  <span
                    className="cursor-pointer text-lg"
                    onClick={handleDecrementQuantity}
                  >
                    -
                  </span>
                  <span className="mx-1">{quantity}</span>
                  <span
                    className="cursor-pointer text-lg"
                    onClick={handleIncrementQuantity}
                  >
                    +
                  </span>
                </div>
                <button
                  onClick={handleStep1}
                  className={`flex w-full justify-center rounded font-semibold bg-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg shadow text-white  py-3 `}
                >
                  Checkout{" "}
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <div className="p-5">
              <div className="bg-zinc-100 p-4 rounded   col-span-12">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Item (x{quantity})</span>
                    <span>
                      {isNegotiate
                        ? (
                            quantity * Number(offerAmount.replace(/,/g, ""))
                          ).toLocaleString()
                        : (
                            quantity * Number(product.inventory.offer_price)
                          ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Security Deposit</span>
                    <span>
                      ₦{product.inventory.security_deposit.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4"></div>
                  <div className="flex justify-between items-center text-gray-900 font-bold text-lg">
                    <span>Subtotal=</span>
                    <div className="flex items-baseline space-x-3">
                      ₦
                      {isNegotiate && (
                        <span className="line-through text-gray-400 text-base">
                          {(
                            Number(rentalDuration) *
                              quantity *
                              Number(product.inventory.offer_price) +
                            product.inventory.security_deposit
                          ).toLocaleString()}
                        </span>
                      )}
                      <span className="text-orange-500">
                        {" "}
                        ₦{total.toLocaleString()}{" "}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 px-4 py-2 font-medium  flex items-start gap-2  border-green-400 bg-green-50 border text-sm rounded ">
                  The above subtotal covers your rent for{" "}
                  {rentalDuration.toLocaleString()}{" "}
                  {structureRentalDuration(product.inventory.rental_duration)}s
                </div>
                {isNegotiate && (
                  <div className="mt-4 p-4 font-medium shadow-md flex items-start gap-2  shadow-green-300 text-white text-sm rounded bg-green-500">
                    <IoMdInformationCircleOutline className="shrink-0 text-lg" />
                    The above subtotal is based on your stated negotiation
                    amount
                  </div>
                )}
              </div>

              <button
                onClick={handleStep2}
                className={` ${
                  isLoading ? "animate-pulse cursor-wait " : " opacity-100 "
                } flex w-full justify-center mt-4 rounded font-semibold bg-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg shadow text-white  py-3 `}
              >
                Checkout{" "}
              </button>

              <button
                onClick={() => setStep(1)}
                className={`flex w-full mt-3 justify-center rounded font-semibold border border-orange-400 hover:bg-[#fff8ef]  hover:shadow-lg shadow   py-3 `}
              >
                Back{" "}
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="p-5">
              <h3 className="text-lg text-left font-medium mb-2">
                Booking Successful!
              </h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                nostrum rerum doloribus, ipsum quae possimus! Quos quia
              </p>

              <div className="grid grid-cols-12 gap-3 mt-4">
                <button
                  onClick={() => {
                    router.push(`/chat/${product.user.id}`); // Redirect to login page
                  }}
                  className={`flex w-full col-span-6  items-center gap-2 justify-center rounded font-semibold border border-orange-400 hover:bg-[#fff8ef]  hover:shadow-lg shadow   py-3 `}
                >
                  <IoChatbubbleEllipsesOutline />
                  Chat{" "}
                </button>{" "}
                <button
                  // onClick={() => setStep(1)}
                  className={`flex w-full col-span-6  items-center gap-2 justify-center rounded font-semibold border border-orange-400 hover:bg-[#fff8ef]  hover:shadow-lg shadow   py-3 `}
                >
                  <FaPhoneVolume />
                  Contact{" "}
                </button>
                <button
                  onClick={() => setIsShowBookingModal(false)}
                  className={`col-span-12 flex w-full justify-center rounded font-semibold bg-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg shadow text-white  py-3 `}
                >
                  Close{" "}
                </button>
              </div>
            </div>
          )}
          {/* {error && <div className="p-5 text-red-400">Error: {error}</div>} */}
        </div>{" "}
      </div>
    </>
  );
}
