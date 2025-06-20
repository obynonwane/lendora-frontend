import { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "radix-ui";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { UserData_TYPE } from "@/app/types";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";
import { saveToLocalStorage } from "@/app/utils/utility";

// import { useAuth } from "../auth-context";
function KycModal({
  setIsShowKycModal,
  userData,
}: {
  setIsShowKycModal: (value: boolean) => void;
  userData: UserData_TYPE;
}) {
  type LGA = {
    id: string;
    name: string;
    lga_slug: string;
  };
  type State = {
    id: string;
    name: string;
    lgas: LGA[];
    state_slug: string;
  };

  type Country = {
    code: string;
    id: string;
    name: string;
    states: State[];
  };
  type ID_TYPE = {
    created_at: string;
    id: string;
    name: string;
    updated_at: string;
  };
  type ApiResponse<T> = {
    error: boolean;
    message: string;
    status_code: number;
    data: T[];
  };
  //   console.log(userData);
  const isBusiness =
    userData.detail.user.accountType.name === "business" ? true : false;
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedLGA, setSelectedLGA] = useState<LGA | null>(null);
  const [address, setAddress] = useState<string>("");
  const [fullName, setFullname] = useState<string>("");
  const [cacNumber, setCacNumber] = useState<string>("");
  const [idNumber, setIdNumber] = useState<string>("");
  const [businessRegistered, setBusinessRegistered] = useState<
    boolean | null
  >();
  const toastOptions = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
  };
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [selectedIdType, setSelectedIdType] = useState<ID_TYPE | null>(null);
  const router = useRouter();

  const idTypes = [
    {
      created_at: "2025-05-28T16:08:06.982Z",
      id: "a669fc69-0e60-4711-8e8e-a0b367e10e77",
      name: "nin",
      updated_at: "2025-05-28T16:08:06.982Z",
    },
    {
      created_at: "2025-05-28T16:08:06.982Z",
      id: "c81cd26a-7d20-4b79-8e7c-af9b8bc974dd",
      name: "international passport",
      updated_at: "2025-05-28T16:08:06.982Z",
    },
    {
      created_at: "2025-05-28T16:08:06.982Z",
      id: "56d96a0e-7f00-4617-a814-40b55dc33eac",
      name: "driver licence",
      updated_at: "2025-05-28T16:08:06.982Z",
    },
  ];
  useEffect(() => {
    const fetchStates = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse<Country>>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/countries`
        );
        setCountries(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          //   setError(err.message || "Failed to fetch states");
        } else {
          //   setError("Failed to fetch states");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStates();
  }, []);

  const refetchUser = async () => {
    try {
      setIsLoading(true);

      const user = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/get-me`,
        {
          headers: {
            Authorization: `Bearer ${userData.access_token}`,
          },
        }
      );

      console.log("lendora_user", user.data.data);
      const newD = userData;
      newD.detail.kyc_detail = user.data.data.kyc_detail;
      newD.detail.roles = user.data.data.roles;
      newD.detail.user = user.data.data.user;
      saveToLocalStorage("lendora_user", newD);
      setIsShowKycModal(false);
      // toast.success("sign-in successful!", toastOptions);
      // refreshAuth();
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
        if (errors.response?.data?.message.includes("unauthorized")) {
          router.push("/login");
        }

        setIsLoading(false);
      } else {
        // Handle all other errors
        toast.error("An unexpected error occurred.", toastOptions);
        setIsLoading(false);
      }
    }
  };

  const handleBusinessStep1 = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);

      const objectShape = yup.object().required().shape({
        id: yup.string().required(),
        name: yup.string().required(),
      });

      const validationSchema = yup.object().shape({
        selectedState: objectShape.label("State"),
        selectedLGA: objectShape.label("LGA"),
        address: yup.string().required("Address is required"),
        fullName: yup.string().required("Business name is required"),
        businessRegistered: yup
          .boolean()
          .required("Is your business registered?"),
      });
      const formData = {
        selectedState,
        selectedLGA,
        address,
        fullName,
        businessRegistered,
      };

      // validateinput
      await validationSchema.validate(formData, { abortEarly: false });
      if (businessRegistered && cacNumber.length === 0) {
        return toast.error("Cac Number is required", toastOptions);
      }

      const d = {
        business_registered: businessRegistered ? "yes" : "no",
        cac_number: cacNumber,
        display_name: fullName,
        address_country: countries && countries[0].id,
        address_state: selectedState?.id,
        address_lga: selectedLGA?.id,
        address_street: address,
      };
      // console.log(d);

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/kyc-business`,
        d,
        {
          headers: {
            Authorization: `Bearer ${userData.access_token}`,
          },
        }
      );
      setIsLoading(false);
      await refetchUser();
      setStep(2);
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
  };
  const handleIndividualStep1 = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);

      const objectShape = yup.object().required().shape({
        id: yup.string().required(),
        name: yup.string().required(),
      });

      const validationSchema = yup.object().shape({
        selectedState: objectShape.label("State"),
        selectedLGA: objectShape.label("LGA"),
        address: yup.string().required("Address is required"),

        selectedIdType: objectShape.label("ID type"),
        idNumber: yup.string().required("ID Number is required"),

        primaryImage: yup
          .mixed<File>()
          .required("Primary image is required")
          .test(
            "is-file",
            "Must be a valid file",
            (value) => value instanceof File
          ),
      });
      const data = {
        selectedState,
        selectedLGA,
        address,
        selectedIdType,
        idNumber,
        primaryImage,
      };

      // validateinput
      await validationSchema.validate(data, { abortEarly: false });

      console.log(data);

      const formData = new FormData();
      formData.append("address_state", selectedState?.id?.toString() ?? "");
      formData.append("address_lga", selectedLGA?.id?.toString() ?? "");
      formData.append("address_country", (countries && countries[0]?.id) || "");
      formData.append("id_type", selectedIdType?.id?.toString() ?? "");
      if (primaryImage) {
        formData.append("file", primaryImage);
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/kyc-renter`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userData.access_token}`,
          },
        }
      );
      setIsLoading(false);
      await refetchUser();
      setStep(2);
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
      } else {
        // Handle all other errors
        toast.error("An unexpected error occurred.", toastOptions);
        setIsLoading(false);
      }
    }
  };
  const locationFullname = () => {
    return (
      <>
        {countries ? (
          <>
            {/* select state */}
            <div className="relative col-span-12 md:col-span-6 overflow-hidden flex flex-col gap-2">
              <h4>State</h4>

              <Select.Root
                onValueChange={(val: string) => {
                  // radix ui select only allows strings as its value
                  const selected = countries[0].states.find(
                    (s) => s.name.toString() === val
                  );
                  if (selected) {
                    setSelectedState(selected);
                    console.log(selected);
                    setSelectedLGA(null);
                  }
                }}
              >
                <Select.Trigger
                  className="inline-flex items-center w-full justify-between px-4 py-3 bg-white border-slate-400 hover:border-slate-900 border rounded  text-sm  "
                  aria-label="Select a State"
                >
                  <Select.Value placeholder="Select a State" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content
                    position="popper"
                    className="SelectContent bg-white border rounded shadow-md max-h-40 w-full [9999999999999999999999999999999999999999999999999999999999999999999999999999999]"
                  >
                    <Select.ScrollUpButton className="flex items-center justify-center  bg-white">
                      <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="p-1">
                      {countries[0].states?.map((state) => (
                        <Select.Item
                          key={state.id + state.name}
                          value={state?.name}
                          className={`relative flex items-center px-2 py-2 text-sm cursor-pointer  select-none ${
                            selectedState?.id === state?.id
                              ? "bg-orange-100 text-orange-400 font-medium"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <Select.ItemText>{state.name}</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            {/* <CheckIcon /> */}
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white">
                      <ChevronDownIcon />
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
            {/* lga */}
            <div
              className={`relative col-span-12 md:col-span-6 overflow-hidden flex flex-col gap-2 ${
                !selectedState ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <h4>Local Government Area</h4>
              <Select.Root
                disabled={!selectedState}
                onValueChange={(val) => {
                  //
                  // radix ui select only allows strings as its value
                  const selected = selectedState?.lgas.find(
                    (s) => s.name.toString() === val
                  );
                  if (selected) {
                    setSelectedLGA(selected);
                  }
                }}
              >
                <Select.Trigger
                  className={` inline-flex items-center w-full justify-between px-4 py-3 border-slate-400 hover:border-slate-900 bg-white border rounded shadow text-sm `}
                  aria-label="Select an LGA"
                >
                  <Select.Value placeholder="Select an LGA" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content
                    position="popper"
                    className="SelectContent bg-white border rounded shadow-md max-h-40 w-full [9999999999999999999999999999999999999999999999999999999999999999999999999999999]"
                  >
                    <Select.ScrollUpButton className="flex items-center justify-center  bg-white">
                      <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="p-1">
                      {selectedState?.lgas?.map((lga) => (
                        <Select.Item
                          key={lga.id}
                          value={lga?.name}
                          className={`relative flex items-center px-2 py-2 text-sm cursor-pointer  select-none ${
                            selectedLGA?.id === lga?.id
                              ? "bg-orange-100 text-orange-400 font-medium"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <Select.ItemText>{lga.name}</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center"></Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white">
                      <ChevronDownIcon />
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
            {/* address */}
            <div
              className={`relative col-span-12  overflow-hidden flex flex-col gap-2 `}
            >
              <label className=" font-medium block text-slate-700">
                Address
              </label>
              <input
                className="border border-slate-400 hover:border-slate-900 py-3 px-4    w-full    rounded text-slate-700  outline-amber-500  "
                type="text"
                placeholder=""
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="h-56 bg-zinc-200 animate-pulse col-span-12"></div>
        )}
      </>
    );
  };

  if (!isBusiness) {
    return (
      <>
        <div
          // onClick={() => {
          //   console.log("clocked");
          // }}
          className="fixed z-[50] h-screen cursor-pointer inset-0 bg-black/50"
        ></div>

        <div className="flex z-[60] fixed lendora-modal inset-0 items-center pt-10">
          <div className="bg-white overflow-y-auto  rounded-md m-auto md:w-[500px]  w-[90%]  max-h-[90vh]  md:max-h-[80vh]">
            <h3 className="text-center text-base mt-3 flex items-center justify-between px-5">
              <span className="font-semibold"> KYC VERIFICATION</span>{" "}
              <IoMdClose
                className="cursor-pointer"
                onClick={() => {
                  setIsShowKycModal(true);
                }}
              />
            </h3>

            {step === 1 && (
              <form
                className=" w-full p-5 grid grid-cols-12 gap-3 relative"
                onSubmit={handleIndividualStep1}
              >
                {locationFullname()}

                {/* select state */}
                <div className="relative col-span-12 overflow-hidden flex flex-col gap-2">
                  <h4>Select ID Type</h4>

                  <Select.Root
                    onValueChange={(val: string) => {
                      // radix ui select only allows strings as its value
                      const selected = idTypes.find(
                        (s) => s.name.toString() === val
                      );
                      if (selected) {
                        setSelectedIdType(selected);
                      }
                    }}
                  >
                    <Select.Trigger
                      className="inline-flex items-center capitalize w-full justify-between px-4 py-3 bg-white border-slate-400 hover:border-slate-900 border rounded  text-sm  "
                      aria-label="Select ID"
                    >
                      <Select.Value placeholder="Select ID" />
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content
                        position="popper"
                        className="SelectContent capitalize bg-white border rounded shadow-md max-h-40 w-full [9999999999999999999999999999999999999999999999999999999999999999999999999999999]"
                      >
                        <Select.ScrollUpButton className="flex items-center justify-center  bg-white">
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                          {idTypes.map((id) => (
                            <Select.Item
                              key={id.id + id.name}
                              value={id?.name}
                              className={`relative flex items-center px-2 py-2 text-sm cursor-pointer  select-none ${
                                selectedIdType?.id === id?.id
                                  ? "bg-orange-100 text-orange-400 font-medium"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <Select.ItemText className="capitalize">
                                {id.name}
                              </Select.ItemText>
                              <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                                {/* <CheckIcon /> */}
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white">
                          <ChevronDownIcon />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
                <div
                  className={`relative col-span-12  overflow-hidden flex flex-col gap-2 `}
                >
                  <label className=" font-medium block text-slate-700">
                    {" "}
                    <span className="uppercase">
                      {selectedIdType ? selectedIdType.name : "ID"}
                    </span>{" "}
                    Number
                  </label>
                  <input
                    className="border border-slate-400 hover:border-slate-900 py-3 px-4    w-full    rounded text-slate-700  outline-amber-500  "
                    type="text"
                    placeholder=""
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                  />
                </div>
                {/* primary image */}
                <div className="relative col-span-12 overflow-hidden flex flex-col gap-2">
                  <h4>
                    Upload a picture of your{" "}
                    <span className="uppercase">
                      {selectedIdType ? selectedIdType.name : "ID"}
                    </span>
                  </h4>

                  <ImageUpload
                    value={primaryImage}
                    onImageChange={(file) => {
                      if (file instanceof File || file === null) {
                        setPrimaryImage(file);
                      }
                    }}
                    allowMultiple={false}
                  />
                </div>

                <button
                  type="submit"
                  className={`flex w-full justify-center col-span-12 rounded font-semibold bg-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg shadow text-white mt-5 py-4 ${
                    isLoading ? "animate-pulse cursor-wait " : " opacity-100 "
                  }`}
                >
                  Submit Kyc
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="text-center max-w-lg w-full mb-3 rounded mx-auto bg-white p-5">
                <div className="w-32 h-32 rounded-full bg-orange-400 text-white flex items-center mb-3 justify-center mx-auto">
                  <FaCheck className="text-3xl" />
                </div>
                <h3 className="text-lg text-center">Kyc Completed!</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                  nostrum rerum doloribus, ipsum quae possimus! Quos quia
                </p>

                <button
                  onClick={() => {
                    setIsShowKycModal(true);
                  }}
                  className={`flex mt-3 w-full justify-center rounded py-4 col-span-12  bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow  font-semibold `}
                >
                  Close
                </button>
              </div>
            )}
          </div>{" "}
        </div>
      </>
    );
  }
  if (isBusiness) {
    return (
      <>
        <div
          onClick={() => {
            console.log("clocked");
          }}
          className="fixed z-[50]  h-screen cursor-pointer inset-0 bg-black/50"
        ></div>

        <div className="flex z-[60] fixed lendora-modal inset-0 items-center pt-10">
          <div className="bg-white overflow-y-auto  rounded-md m-auto md:w-[500px]  w-[90%]  max-h-[90vh]  md:max-h-[80vh]">
            <h3 className="text-center text-base mt-3 flex items-center justify-between px-5">
              <span className="font-semibold"> KYC VERIFICATION</span>{" "}
              <IoMdClose
                onClick={() => {
                  setIsShowKycModal(true);
                }}
                className="cursor-pointer"
              />
            </h3>

            {step === 1 && (
              <form
                className=" w-full p-5 grid grid-cols-12 gap-3 relative"
                onSubmit={handleBusinessStep1}
              >
                {/* <button type="button" onClick={refetchUser}>
                  ffffffffff
                </button> */}
                <div
                  className={`relative col-span-12  overflow-hidden flex flex-col gap-2 `}
                >
                  <label className=" font-medium block text-slate-700">
                    Business Name
                  </label>
                  <input
                    className="border border-slate-400 hover:border-slate-900 py-3 px-4    w-full    rounded text-slate-700  outline-amber-500  "
                    type="text"
                    placeholder=""
                    value={fullName}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
                {locationFullname()}

                {/* cac */}
                <div
                  className={`relative col-span-12  overflow-hidden flex flex-wrap gap-2 `}
                >
                  <label className=" font-medium block w-full text-slate-700">
                    Is Your Business Registered?
                  </label>

                  <p
                    onClick={() => setBusinessRegistered(true)}
                    className=" text-center cursor-pointer text-slate-700 text-sm flex items-start"
                  >
                    <span
                      className={`w-5 h-5 flex-shrink-0 rounded flex items-center justify-center mr-2 ${
                        businessRegistered === true
                          ? "bg-orange-400 text-white"
                          : "bg-zinc-200 text-zinc-600 "
                      }`}
                    >
                      {businessRegistered === true && <FaCheck />}
                    </span>{" "}
                    Yes, it is
                  </p>
                  <p
                    onClick={() => setBusinessRegistered(false)}
                    className=" text-center cursor-pointer ml-5 text-slate-700 text-sm flex items-start"
                  >
                    <span
                      className={`w-5 h-5 flex-shrink-0 rounded flex items-center justify-center mr-2 ${
                        businessRegistered === false
                          ? "bg-orange-400 text-white"
                          : "bg-zinc-200 text-zinc-600 "
                      }`}
                    >
                      {businessRegistered === false && <FaCheck />}
                    </span>{" "}
                    No, it isn&apos;t
                  </p>
                </div>
                {/* cac */}
                {businessRegistered && (
                  <div
                    className={`relative col-span-12  overflow-hidden flex flex-col gap-2 `}
                  >
                    <label className=" font-medium block text-slate-700">
                      C.A.C
                    </label>
                    <input
                      className="border border-slate-400 hover:border-slate-900 py-3 px-4    w-full    rounded text-slate-700  outline-amber-500  "
                      type="text"
                      placeholder=""
                      value={cacNumber}
                      onChange={(e) => setCacNumber(e.target.value)}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className={`flex w-full justify-center col-span-12 rounded font-semibold bg-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg shadow text-white mt-5 py-4 ${
                    isLoading ? "animate-pulse cursor-wait " : " opacity-100 "
                  }`}
                >
                  Submit Kyc
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="text-center max-w-lg w-full mb-3 rounded mx-auto bg-white p-5">
                <div className="w-32 h-32 rounded-full bg-orange-400 text-white flex items-center mb-3 justify-center mx-auto">
                  <FaCheck className="text-3xl" />
                </div>
                <h3 className="text-lg text-center">Kyc Completed!</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                  nostrum rerum doloribus, ipsum quae possimus! Quos quia
                </p>

                <button
                  onClick={() => {
                    setIsShowKycModal(true);
                  }}
                  className={`flex mt-3 w-full justify-center rounded py-4 col-span-12  bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow  font-semibold `}
                >
                  Close
                </button>
              </div>
            )}
          </div>{" "}
        </div>
      </>
    );
  }
}

export default KycModal;
