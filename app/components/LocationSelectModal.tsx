import React, { useEffect, useState } from "react";
import axios from "axios";
import { RxCaretRight } from "react-icons/rx";
import { useRouter, useSearchParams } from "next/navigation";

type State = {
  id: string;
  name: string;
};

type LGA = {
  id: string;
  name: string;
};

type ApiResponse<T> = {
  error: boolean;
  message: string;
  status_code: number;
  data: T[];
};

type Props = {
  selectedState: State | null;
  setSelectedState: (value: State | null) => void;
  selectedLGA: LGA | null;
  setSelectedLGA: (value: LGA | null) => void;
  setIsShowSelectStateModal: (value: boolean) => void;
};

function LocationSelectModal({
  selectedState,
  setSelectedState,
  selectedLGA,
  setSelectedLGA,
  setIsShowSelectStateModal,
}: Props) {
  const [states, setStates] = useState<State[] | null>(null);
  const [lgas, setLGAs] = useState<LGA[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  // const [searchQuery, setSearchQurey] = useState<string>("");
  // step 1 is select state
  // step 2 is select lga

  const searchParams = useSearchParams();
  useEffect(() => {
    console.log("rerender");
  }, []);

  // const state_id = searchParams.get("state_id") || "";
  // const lga_id = searchParams.get("lga_id") || "";
  const category_id = searchParams.get("category_id") || "";
  const subcategory_id = searchParams.get("subcategory_id") || "";
  const s = searchParams.get("s") || "";

  const router = useRouter();

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      try {
        const response = await axios.get<ApiResponse<State>>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/states`
        );
        setStates(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch states");
        } else {
          setError("Failed to fetch states");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const fetchLGAs = async () => {
      if (!selectedState) return;
      setLoading(true);
      try {
        const response = await axios.get<ApiResponse<LGA>>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/state/lgas/${selectedState.id}`
        );
        setLGAs(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch LGAs");
        } else {
          setError("Failed to fetch LGAs");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLGAs();
  }, [selectedState]);

  return (
    <>
      <div
        onClick={() => setIsShowSelectStateModal(false)}
        className="fixed z-[299] cursor-pointer inset-0 bg-black/50"
      ></div>
      <div className="bg-[#EBF2F7] z-[300] fixed lendora-modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[400px] h-[90%] md:h-[80%] overflow-x-hidden rounded-md">
        {/* <div className="bg-[#EBF2F7] z-[300] fixed lendora-modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[80%] h-[90%] md:h-[80%] overflow-x-hidden rounded-md"> */}

        {step === 1 && (
          <>
            {states && (
              <div className="px-5 my-3">
                <h4 className="text-lg font-medium mb-4">
                  All Nigerian States
                </h4>

                <div className="grid grid-cols-1  gap-x-8 gap-y-6">
                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-6"> */}
                  {Object.entries(
                    states
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .reduce((acc: Record<string, State[]>, state) => {
                        const firstLetter = state.name[0].toUpperCase();
                        if (!acc[firstLetter]) acc[firstLetter] = [];
                        acc[firstLetter].push(state);
                        return acc;
                      }, {})
                  ).map(([letter, group]) => (
                    <div key={letter}>
                      <h5 className="text-md font-semibold mb-2">{letter}</h5>
                      <div className="flex flex-col gap-1">
                        {group.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              // console.log(item);
                              setSelectedState(item);
                              if (selectedState?.id !== item.id) {
                                setSelectedLGA(null);
                                setLGAs(null);
                                setLoading(true);
                              }

                              setStep(2);
                            }}
                            className={`p-2 rounded flex justify-between items-center text-left transition text-sm ${
                              selectedState?.id === item.id
                                ? "bg-orange-400 text-white"
                                : "bg-black/5 hover:bg-black/10"
                            }`}
                          >
                            {item.name}{" "}
                            <span className="text-xs text-gray-500">
                              <RxCaretRight />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            {" "}
            {/* LGAs */}
            {selectedState && (
              <div className="px-5 mt-3">
                {lgas && (
                  <div className=" mt-3">
                    <h4 className="text-lg font-medium flex items-center gap-2 mb-3">
                      {" "}
                      <span
                        onClick={() => setStep(1)}
                        className="text-2xl px-2 py-1 bg-black/10 rounded cursor-pointer"
                      >
                        <RxCaretRight className=" rotate-180 " />
                      </span>
                      LGAs in {selectedState.name} State
                    </h4>
                    {Object.entries(
                      lgas
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .reduce((acc: Record<string, LGA[]>, lga) => {
                          const firstLetter = lga.name[0].toUpperCase();
                          if (!acc[firstLetter]) acc[firstLetter] = [];
                          acc[firstLetter].push(lga);
                          return acc;
                        }, {})
                    ).map(([letter, group]) => (
                      <div key={letter} className="mb-4">
                        <h5 className="text-md font-semibold mb-1">{letter}</h5>
                        <div className="flex flex-col gap-1 w-full">
                          {group.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                setSelectedLGA(item);
                                setIsShowSelectStateModal(false);
                                router.push(
                                  `/?s=${s}&category_id=${category_id}&subcategory_id=${subcategory_id}&state_id=${selectedState.id}&lga_id=${item.id}`
                                );
                              }}
                              className={`p-2 rounded flex justify-between items-center transition text-sm ${
                                selectedLGA?.id === item.id
                                  ? "bg-orange-400 text-white"
                                  : "bg-black/5 hover:bg-black/10"
                              } w-full `}
                            >
                              {item.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {loading && (
          <div className=" text-center  pt-20 flex justify-center">
            {" "}
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-400 fill-orange-400"
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
        )}
        {error && <div className="p-5 text-red-500">Error: {error}</div>}
      </div>
    </>
  );
}

export default LocationSelectModal;
