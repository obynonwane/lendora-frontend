import React, { useState } from "react";
// import axios from "axios";
import { RiCloseLine } from "react-icons/ri";
import { ProductPageProduct } from "@/app/types";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaPhoneVolume } from "react-icons/fa";

// type LGA = {
//   id: string;
//   name: string;
//   lga_slug: string;
// };
// type State = {
//   id: string;
//   name: string;
//   lgas: LGA[];
//   state_slug: string;
// };

// type Country = {
//   code: string;
//   id: string;
//   name: string;
//   states: State[];
// };

// type ApiResponse<T> = {
//   error: boolean;
//   message: string;
//   status_code: number;
//   data: T[];
// };

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
  //   const [countries, setCountries] = useState<Country[] | null>(null);
  // const [states, setStates] = useState<State[] | null>(null);
  // const [lgas, setLGAs] = useState<LGA[] | null>(null);
  //   const [loading, setLoading] = useState<boolean>(true);
  //   const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);

  const formatNumber = (value: string): string => {
    const num = value.replace(/\D/g, ""); // Remove non-numeric characters
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
  };

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
  const [pickupDate, setPickupDate] = useState(getTodayDate());
  const [isNegotiate, setIsNegotiate] = useState(false);

  //   useEffect(() => {
  //     const fetchStates = async () => {
  //       setLoading(true);
  //       try {
  //         const response = await axios.get<ApiResponse<Country>>(
  //           `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/countries`
  //         );
  //         setCountries(response.data.data);
  //       } catch (err: unknown) {
  //         if (err instanceof Error) {
  //           setError(err.message || "Failed to fetch states");
  //         } else {
  //           setError("Failed to fetch states");
  //         }
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchStates();
  //   }, []);

  return (
    <>
      {/* <div
        onClick={() => setIsShowBookingModal(false)}
        className="fixed z-[2999999999999] h-screen cursor-pointer inset-0 bg-black/50"
      ></div> */}

      <div className="flex z-[300999999999900] fixed lendora-modal inset-0 items-center pt-10 bg-black/50">
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
                    <span>Pick-up Date</span>
                  </label>
                  <input
                    type="date"
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
                  onClick={() => setStep(2)}
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
                    <span>Security Fee</span>
                    <span>
                      {product.inventory.security_deposit.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4"></div>
                  <div className="flex justify-between items-center text-gray-900 font-bold text-lg">
                    <span>Subtotal=</span>
                    <div className="flex items-baseline space-x-3">
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
                        {isNegotiate
                          ? (
                              Number(rentalDuration.replace(/,/g, "")) *
                                quantity *
                                Number(offerAmount.replace(/,/g, "")) +
                              product.inventory.security_deposit
                            ).toLocaleString()
                          : (
                              Number(rentalDuration.replace(/,/g, "")) *
                                quantity *
                                Number(product.inventory.offer_price) +
                              product.inventory.security_deposit
                            ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                {isNegotiate && (
                  <div className="mt-6 p-4 font-medium shadow-md flex items-start gap-2  shadow-green-300 text-white text-sm rounded-md bg-green-500">
                    <IoIosInformationCircleOutline className="shrink-0 text-lg" />
                    The above subtotal is based on your stated negotiation
                    amount
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(3)}
                className={`flex w-full justify-center mt-4 rounded font-semibold bg-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg shadow text-white  py-3 `}
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
                  onClick={() => setStep(1)}
                  className={`flex w-full col-span-6  items-center gap-2 justify-center rounded font-semibold border border-orange-400 hover:bg-[#fff8ef]  hover:shadow-lg shadow   py-3 `}
                >
                  <IoChatbubbleEllipsesOutline />
                  Chat{" "}
                </button>{" "}
                <button
                  onClick={() => setStep(1)}
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
