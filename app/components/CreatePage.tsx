"use client";
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import axios from "axios";
import { getFromLocalStorage } from "../utility";
import { Select } from "radix-ui";
import { Popover } from "radix-ui";
import { useAuth } from "../auth-context";

import {
  Category_TYPE,
  SubCategory_TYPE,
  State_TYPE,
  LGA_TYPE,
} from "../types";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
// import { localCategories } from "../categories";

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import ImageUpload from "./ImageUpload";
// import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
function CreatePage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  // const Lcategories: Category_TYPE[] = localCategories;

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category_TYPE[] | null>([]);
  const [subCategories, setSubCategories] = useState<SubCategory_TYPE[]>([]);
  // const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<Category_TYPE | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory_TYPE | null>(null);
  const token = getFromLocalStorage("lendora_ac_tk");
  const [selectedState, setSelectedState] = useState<State_TYPE | null>(null);
  const [selectedLGA, setSelectedLGA] = useState<LGA_TYPE | null>(null);

  const [price, setPrice] = useState("");
  const [lgas, setLGAs] = useState<LGA_TYPE[]>([]);
  const [states, setStates] = useState<State_TYPE[]>([]);

  const [productPurpose, setProductPurpose] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isNegotiable, setIsNegotiable] = useState<null | boolean>(null);
  const [isAvailable, setIsAvailable] = useState<null | boolean>(null);
  const [rentalDuration, setRentalDuration] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [galleryImages, setGalleryImages] = useState<File[] | null>(null);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);

  const [categoryPopoverStep, setCategoryPopoverStep] = useState(1);
  const productPurposes = ["rental", "sale"];
  const rentalDurations = ["hourly", "daily", "monthly", "annually"];

  const titleMaxLength = 60;
  const descriptionMaxLength = 800;

  const formatNumber = (value: string): string => {
    const num = value.replace(/\D/g, ""); // Remove non-numeric characters
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
  };

  // const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   const rawValue = e.target.value;
  //   setPrice(formatNumber(rawValue));
  // };

  const handleAmountChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const rawValue = e.target.value;
      setter(formatNumber(rawValue));
    };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= titleMaxLength) {
      setTitle(value);
    }
  };
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length <= descriptionMaxLength) {
      setDescription(value);
    }
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleStep1 = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    const objectShape = yup.object().required().shape({
      id: yup.string().required(),
      name: yup.string().required(),
    });

    const validationSchema = yup.object().shape({
      title: yup.string().required("Title is required"),
      productPurpose: yup.string().required("Are you Renting or Selling?"),
      selectedCategory: objectShape.label("Category"),
      selectedSubCategory: objectShape.label("Subcategory"),
      description: yup
        .string()
        .min(100)
        .max(800)
        .required("Description is required"),
      tags: yup
        .array()
        .of(yup.string().required("Tag cannot be empty"))
        .min(2, "At least 2 tags are required")
        .required("Tags are required"),

      // selectedState: objectShape.label("State"),
      // selectedLGA: objectShape.label("LGA"),

      // primaryImage: yup
      //   .mixed<File>()
      //   .required("Primary image is required")
      //   .test(
      //     "is-file",
      //     "Must be a valid file",
      //     (value) => value instanceof File
      //   ),
      // galleryImages: yup
      //   .array()
      //   .of(
      //     yup
      //       .mixed<File>()
      //       .test(
      //         "is-file",
      //         "Must be a valid file",
      //         (value) => value instanceof File
      //       )
      //   )
      //   .min(1, "At least one gallery image is required")
      //   .required("Gallery images are required"),
    });

    const data = {
      title,
      productPurpose,
      selectedCategory,
      selectedSubCategory,
      description,
      tags,
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

  const handleStep2 = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    const validationSchema = yup.object().shape({
      price: yup
        .string()
        .required("Price is required")
        .test("is-valid-price", "Price must be a valid number", (value) => {
          if (!value) return false;
          const numericValue = value.replace(/,/g, "");
          return !isNaN(Number(numericValue)) && Number(numericValue) > 0;
        }),
      isNegotiable: yup.boolean().required("Is the price negotiable?"),
      quantity: yup
        .string()
        .required("Quantity is required")
        .test(
          "is-valid-quantity",
          "Quantity must be a valid number",
          (value) => {
            if (!value) return false;
            const numericValue = value.replace(/,/g, "");
            return !isNaN(Number(numericValue)) && Number(numericValue) > 0;
          }
        ),
      isAvailable: yup.boolean().required("Is the Item Available?"),

      productPurpose: yup.string().required("Product purpose is required"),
      //  securityDeposit: yup
      //         .string()
      //         .required("Security Deposit is required")
      //         .test(
      //           "is-valid-securityDeposit",
      //           "Security Deposit must be a valid number",
      //           (value) => {
      //             if (!value) return false;
      //             const numericValue = value.replace(/,/g, "");
      //             return !isNaN(Number(numericValue)) && Number(numericValue) > 0;
      //           }
      //         ),
      securityDeposit: yup.string().when("productPurpose", {
        is: "rental",
        then: (schema) => schema.required("Security Deposit is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      rentalDuration: yup.string().when("productPurpose", {
        is: "rental",
        then: (schema) => schema.required("Rental Duration is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      // rentalDuration: yup.string().required("Rental Duration is required"),
    });

    const data = {
      price,
      isNegotiable,
      quantity,
      isAvailable,
      productPurpose,
      securityDeposit,
      rentalDuration,
    };

    try {
      await validationSchema.validate(data, {
        abortEarly: false,
      });
      setStep(3);
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
  const handleStep3 = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    const objectShape = yup.object().required().shape({
      id: yup.string().required(),
      name: yup.string().required(),
    });

    const validationSchema = yup.object().shape({
      selectedState: objectShape.label("State"),
      selectedLGA: objectShape.label("LGA"),
    });

    const data = {
      selectedState,
      selectedLGA,
    };

    try {
      await validationSchema.validate(data, {
        abortEarly: false,
      });
      setStep(4);
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

  const handleStep4 = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    const validationSchema = yup.object().shape({
      primaryImage: yup
        .mixed<File>()
        .required("Primary image is required")
        .test(
          "is-file",
          "Must be a valid file",
          (value) => value instanceof File
        ),
      galleryImages: yup
        .array()
        .of(
          yup
            .mixed<File>()
            .test(
              "is-file",
              "Must be a valid file",
              (value) => value instanceof File
            )
        )
        .min(1, "At least one gallery image is required")
        .required("Gallery images are required"),
    });

    const data = {
      primaryImage,
      galleryImages,
    };

    try {
      await validationSchema.validate(data, {
        abortEarly: false,
      });
      handleSubmit(); // console.log("good to go");
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

  const handleStepClick = async (index: number) => {
    if (index === 1) {
      return setStep(1);
    }
    if (index === 2) {
      return handleStep1();
    }
    if (index === 3) {
      handleStep1();
      handleStep2();
      return;
    }
    if (index === 4) {
      handleStep1();
      handleStep2();
      handleStep3();
      return;
    }
  };
  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("category_id", selectedCategory?.id?.toString() ?? "");
      formData.append(
        "sub_category_id",
        selectedSubCategory?.id?.toString() ?? ""
      );
      formData.append("state_id", selectedState?.id?.toString() ?? "");
      formData.append("lga_id", selectedLGA?.id?.toString() ?? "");
      formData.append("is_available", isAvailable ? "yes" : "no");
      formData.append("negotiable", isNegotiable ? "yes" : "no");
      formData.append("product_purpose", productPurpose);
      formData.append("name", title);
      formData.append("rental_duration", rentalDuration);
      formData.append("offer_price", price.replace(/,/g, ""));
      formData.append("quantity", quantity.replace(/,/g, ""));
      formData.append("security_deposit", securityDeposit.replace(/,/g, ""));
      formData.append("country_id", "e69646c4-a076-45bf-841c-c8e81eb3e03e");
      formData.append("description", description);
      formData.append("tags", tags.join(", "));
      formData.append("metadata", "{}");
      if (primaryImage) {
        formData.append("primary_image", primaryImage);
      }

      galleryImages?.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/create-inventory`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setLoading(false);
      toast.success("Listing Created Successfully!", toastOptions);

      setStep(5);
      // formData.append("price", price.toString());
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

        setLoading(false);
      } else {
        if (
          typeof errors === "object" &&
          errors !== null &&
          "status" in errors &&
          (errors as { status?: number }).status === 401
        ) {
          localStorage.clear();
          refreshAuth();
          router.push("/login");
          // console.error("Unauthorized (401) — local storage cleared.");
        } else {
          console.error("Error:", errors);
        }
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/states`
        );
        setStates(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // setError(err.message || "Failed to fetch states");
        } else {
          // setError("Failed to fetch states");
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
      // setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/state/lgas/${selectedState.id}`
        );
        setLGAs(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // setError(err.message || "Failed to fetch LGAs");
        } else {
          // setError("Failed to fetch LGAs");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLGAs();
  }, [selectedState]);

  useEffect(() => {
    const fetchLGAs = async () => {
      if (!selectedCategory) return;
      //   setLoading(true);
      setSelectedSubCategory(null);
      setSubCategories([]);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/category/subcategory/${selectedCategory.id}`
        );
        // setTimeout(() => {
        setSubCategories(response.data.data);
        // }, 5000);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // setError(err.message || "Failed to fetch LGAs");
        } else {
          // setError("Failed to fetch LGAs");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLGAs();
  }, [selectedCategory]);
  // }, [selectedCategory, selectedCategory?.id]);

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/inventory/all-categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data, "response");
        setCategories(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // setError(err.message || "Failed to fetch categories");
        } else {
          // setError("Failed to fetch states");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [token]);

  const reset = () => {
    setTagInput("");
    setTags([]);
    setLoading(false);
    setCategories([]);
    setSubCategories([]);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedState(null);
    setSelectedLGA(null);
    setPrice("");
    setLGAs([]);
    setStates([]);
    setProductPurpose("");
    setQuantity("");
    setIsNegotiable(null);
    setIsAvailable(null);
    setRentalDuration("");
    setSecurityDeposit("");
    setTitle("");
    setDescription("");
    setGalleryImages(null);
    setPrimaryImage(null);
    setCategoryPopoverStep(1);
    setStep(1);
  };

  if (!categories) {
    return (
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
    );
  }
  return (
    <div className=" max-w-3xl w-full mx-auto gap-5 p-5 text-sm min-h-[calc(100vh-4rem)] lg:flex relative">
      {step !== 5 && (
        <div>
          <div className="bg-white border sticky top-[8.8rem] rounded lg:block hidden p-1  h-fit">
            {[
              "What Are You Listing?",
              "Availability & Pricing",
              "Location",
              "Upload Images",
            ].map((s, index) => (
              <div
                key={index}
                className={`step-item flex items-center gap-3 p-3  rounded cursor-pointer ${
                  step === index + 1
                    ? "bg-orange-50 font-semibold text-orange-400 "
                    : " hover:bg-zinc-100"
                }`}
                // onClick={() => setStep(index + 1)}
                onClick={() => handleStepClick(index + 1)}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-title">{s}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step !== 5 && (
        <section className="lg:hidden mb-3 rounded mx-auto bg-white p-3 flex  ">
          <h1
            className={`text-lg font-medium  mx-auto ${
              step === 2 && "-ml-8 mx-auto"
            }`}
          >
            New Listing
          </h1>
        </section>
      )}

      {step === 5 && (
        <div className="text-center flex-1 mb-3 rounded mx-auto bg-white p-5 h-fit max-w-lg">
          <div className="w-32 h-32 rounded-full bg-orange-400 text-white flex items-center mb-3 justify-center mx-auto">
            <FaCheck className="text-3xl" />
          </div>
          <h3 className="text-lg text-center">Listing Created!</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
            nostrum rerum doloribus, ipsum quae possimus! Quos quia
          </p>

          <button
            onClick={reset}
            className={`flex mt-3 w-full justify-center rounded py-4 col-span-12  bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow  font-semibold `}
          >
            Create New Listing
          </button>
        </div>
      )}
      {step === 2 && (
        <form
          onSubmit={handleStep2}
          className="h-fit flex-1 rounded mx-auto bg-white p-5"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 mt-2 flex w-full justify-between items-center"
            >
              <span>Price (₦)</span>
            </label>
            <input
              type="text"
              id="price"
              value={price}
              className="border border-slate-300 px-2 py-3 rounded w-full"
              // className="currency-input appearance-none border-r border-y rounded-r-md  w-full py-3 px-3 bg-white text-gray-500 leading-tight focus:outline-none"
              placeholder="Price"
              onInput={handleAmountChange(setPrice)}
            />
          </div>

          <div>
            <div
              className={`relative my-5 col-span-12  overflow-hidden flex flex-wrap gap-2 `}
            >
              <label className=" font-medium block w-full text-slate-700">
                Is the price negotiable?
              </label>

              <p
                onClick={() => setIsNegotiable(true)}
                className=" text-center cursor-pointer text-slate-700 text-sm flex items-start"
              >
                <span
                  className={`w-5 h-5 flex-shrink-0 rounded flex items-center justify-center mr-2 ${
                    isNegotiable === true
                      ? "bg-orange-400 text-white"
                      : "bg-zinc-200 text-zinc-600 "
                  }`}
                >
                  {isNegotiable === true && <FaCheck />}
                </span>{" "}
                Yes, it is
              </p>
              <p
                onClick={() => setIsNegotiable(false)}
                className=" text-center cursor-pointer ml-5 text-slate-700 text-sm flex items-start"
              >
                <span
                  className={`w-5 h-5 flex-shrink-0 rounded flex items-center justify-center mr-2 ${
                    isNegotiable === false
                      ? "bg-orange-400 text-white"
                      : "bg-zinc-200 text-zinc-600 "
                  }`}
                >
                  {isNegotiable === false && <FaCheck />}
                </span>{" "}
                No, it isn&apos;t
              </p>
            </div>
          </div>

          <div className="my-2">
            <label htmlFor="title" className="mb-2 mt-2 block">
              <span>Quantity</span>
            </label>
            <input
              type="text"
              id="quantity"
              value={quantity}
              className="border border-slate-300 px-2 py-3 rounded w-full"
              // className="currency-input appearance-none border-r border-y rounded-r-md  w-full py-3 px-3 bg-white text-gray-500 leading-tight focus:outline-none"
              placeholder="Quantity"
              onInput={handleAmountChange(setQuantity)}
            />
          </div>

          <div>
            <div
              className={`relative my-5 col-span-12  overflow-hidden flex flex-wrap gap-2 `}
            >
              <label className=" font-medium block w-full text-slate-700">
                Is this item currently available?
              </label>

              <p
                onClick={() => setIsAvailable(true)}
                className=" text-center cursor-pointer text-slate-700 text-sm flex items-start"
              >
                <span
                  className={`w-5 h-5 flex-shrink-0 rounded flex items-center justify-center mr-2 ${
                    isAvailable === true
                      ? "bg-orange-400 text-white"
                      : "bg-zinc-200 text-zinc-600 "
                  }`}
                >
                  {isAvailable === true && <FaCheck />}
                </span>{" "}
                Yes, it is
              </p>
              <p
                onClick={() => setIsAvailable(false)}
                className=" text-center cursor-pointer ml-5 text-slate-700 text-sm flex items-start"
              >
                <span
                  className={`w-5 h-5 flex-shrink-0 rounded flex items-center justify-center mr-2 ${
                    isAvailable === false
                      ? "bg-orange-400 text-white"
                      : "bg-zinc-200 text-zinc-600 "
                  }`}
                >
                  {isAvailable === false && <FaCheck />}
                </span>{" "}
                No, it isn&apos;t
              </p>
            </div>
          </div>

          {productPurpose === "rental" && (
            <>
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 mt-2 flex w-full justify-between items-center"
                >
                  <span>Security Deposit (₦)</span>
                </label>
                <input
                  type="text"
                  id="sd"
                  value={securityDeposit}
                  className="border border-slate-300 px-2 py-3 rounded w-full"
                  // className="currency-input appearance-none border-r border-y rounded-r-md  w-full py-3 px-3 bg-white text-gray-500 leading-tight focus:outline-none"
                  placeholder="Security Deposit"
                  onInput={handleAmountChange(setSecurityDeposit)}
                />
              </div>

              {/* select rentalDuration */}
              <div className="relative col-span-12  mt-3 mb-5 overflow-hidden flex flex-col gap-2">
                <h4>Rental Duration </h4>
                <Select.Root
                  onValueChange={(val: string) => {
                    // radix ui select only allows strings as its value
                    const selected = rentalDurations.find(
                      (s) => s.toString() === val
                    );
                    if (selected) {
                      setRentalDuration(selected);
                    }
                  }}
                >
                  <Select.Trigger
                    className="inline-flex items-center w-full capitalize justify-between px-4 py-3 bg-white border  borer-slate-300 rounded  text-sm  "
                    aria-label="Rental Duration  "
                  >
                    <Select.Value placeholder="Rental Duration  " />
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content
                      position="popper"
                      className="SelectContent bg-white border rounded shadow-md max-h-40 w-full"
                    >
                      <Select.ScrollUpButton className="flex items-center justify-center  bg-white">
                        <ChevronUpIcon />
                      </Select.ScrollUpButton>
                      <Select.Viewport className="p-1">
                        {rentalDurations.map((p) => (
                          <Select.Item
                            key={p}
                            value={p}
                            className={`relative capitalize flex items-center px-2 py-2 text-sm cursor-pointer  select-none ${
                              rentalDuration === p
                                ? "bg-orange-100 text-orange-400 font-medium"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <Select.ItemText>{p}</Select.ItemText>
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
            </>
          )}

          <button
            className={`flex mt-3 w-full justify-center rounded py-4 col-span-12  bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow  font-semibold ${
              loading ? "animate-pulse cursor-wait " : " opacity-100 "
            }`}
          >
            Next
          </button>
          <button
            onClick={() => setStep(1)}
            className={`flex mt-4 w-full justify-center rounded py-4 col-span-12  border border-orange-400   hover:bg-zinc-100 hover:shadow-lg shadow  font-semibold`}
          >
            Back
          </button>
        </form>
      )}
      {step === 4 && (
        <>
          <form
            onSubmit={handleStep4}
            className="flex-1 h-fit rounded mx-auto bg-white p-5"
          >
            <h4 className="mb-2">Categories</h4>

            {categories && (
              <section className="grid grid-cols-12 gap-3">
                {/* primary image */}
                <div className="relative col-span-12 overflow-hidden flex flex-col gap-2">
                  <h4>Upload Primary Image</h4>
                  {/* <ImageUpload
                    onImageChange={(files: File) => setPrimaryImage(files)}
                  /> */}
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

                {/* secondary image */}
                <div className="relative col-span-12 overflow-hidden flex flex-col gap-2">
                  <h4>Upload Gallery Images</h4>
                  <div>
                    {/* <ImageUpload
                      allowMultiple
                      onImageChange={(files) => setGalleryImages(files)}
                    /> */}
                    <ImageUpload
                      value={galleryImages}
                      onImageChange={(file) => {
                        if (Array.isArray(file) || file === null) {
                          setGalleryImages(file);
                        } else if (file instanceof File) {
                          setGalleryImages([file]);
                        }
                      }}
                      allowMultiple={true}
                    />
                  </div>
                </div>

                {/* next btn */}
                <button
                  className={`flex w-full justify-center rounded py-4 col-span-12  bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-2 font-semibold ${
                    loading ? "animate-pulse cursor-wait " : " opacity-100 "
                  }`}
                >
                  Submit
                </button>

                <button
                  onClick={() => setStep(3)}
                  className={`flex mt-4 w-full justify-center rounded py-4 col-span-12  border border-orange-400   hover:bg-zinc-100 hover:shadow-lg shadow  font-semibold`}
                >
                  Back
                </button>
              </section>
            )}
          </form>
        </>
      )}
      {step === 3 && (
        <>
          <form
            onSubmit={handleStep3}
            className="flex-1 h-fit rounded mx-auto bg-white p-5"
          >
            {categories && (
              <section className="grid grid-cols-12 gap-3">
                {/* select state */}
                <div className="relative col-span-12 md:col-span-6 overflow-hidden flex flex-col gap-2">
                  <h4>State</h4>
                  <Select.Root
                    onValueChange={(val: string) => {
                      // radix ui select only allows strings as its value
                      const selected = states.find(
                        (s) => s.name.toString() === val
                      );
                      if (selected) {
                        setSelectedState(selected);
                        setSelectedLGA(null);
                      }
                    }}
                  >
                    <Select.Trigger
                      className="inline-flex items-center w-full justify-between px-4 py-3 bg-white border rounded shadow text-sm  "
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
                        className="SelectContent bg-white border rounded shadow-md max-h-40 w-full"
                      >
                        <Select.ScrollUpButton className="flex items-center justify-center  bg-white">
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                          {states?.map((state) => (
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
                      const selected = lgas.find(
                        (s) => s.name.toString() === val
                      );
                      if (selected) {
                        setSelectedLGA(selected);
                      }
                    }}
                  >
                    <Select.Trigger
                      className={` inline-flex items-center w-full justify-between px-4 py-3 bg-white border rounded shadow text-sm `}
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
                        className="SelectContent bg-white border rounded shadow-md max-h-40 w-full"
                      >
                        <Select.ScrollUpButton className="flex items-center justify-center  bg-white">
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                          {lgas &&
                            lgas?.map((lga) => (
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

                {/* next btn */}
                <button
                  className={`flex w-full justify-center rounded py-4 col-span-12  bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-2 font-semibold ${
                    loading ? "animate-pulse cursor-wait " : " opacity-100 "
                  }`}
                >
                  Next
                </button>

                <button
                  onClick={() => setStep(2)}
                  className={`flex mt-4 w-full justify-center rounded py-4 col-span-12  border border-orange-400   hover:bg-zinc-100 hover:shadow-lg shadow  font-semibold`}
                >
                  Back
                </button>
              </section>
            )}
          </form>
        </>
      )}
      {step === 1 && (
        <>
          <form
            onSubmit={handleStep1}
            className="flex-1 h-fit rounded mx-auto bg-white p-5 "
          >
            {categories && (
              <section className="grid grid-cols-12 gap-3">
                {/* title */}
                <div className="col-span-12 mb-1">
                  <label
                    htmlFor="title"
                    className="mb-2 flex w-full justify-between items-center"
                  >
                    <span>Title</span>
                    <span className="text-zinc-500">
                      {title.length}/{titleMaxLength}
                    </span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    className="border border-slate-300 px-2 py-3 rounded w-full"
                  />
                </div>

                {/* select purpose */}
                <div className="relative col-span-12  overflow-hidden flex flex-col gap-2">
                  <h4>Are you Renting or selling?</h4>
                  <Select.Root
                    onValueChange={(val: string) => {
                      // radix ui select only allows strings as its value
                      const selected = productPurposes.find(
                        (s) => s.toString() === val
                      );
                      if (selected) {
                        setProductPurpose(selected);
                      }
                    }}
                  >
                    <Select.Trigger
                      value={productPurpose}
                      className="inline-flex items-center w-full capitalize justify-between px-4 py-3 bg-white border  borer-slate-300 rounded  text-sm  "
                      aria-label="Renting or selling? "
                    >
                      <Select.Value placeholder="Renting or selling? " />
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content
                        position="popper"
                        className="SelectContent bg-white border rounded shadow-md max-h-40 w-full"
                      >
                        <Select.ScrollUpButton className="flex items-center justify-center  bg-white">
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                          {productPurposes.map((p) => (
                            <Select.Item
                              key={p}
                              value={p}
                              className={`relative capitalize flex items-center px-2 py-2 text-sm cursor-pointer  select-none ${
                                productPurpose === p
                                  ? "bg-orange-100 text-orange-400 font-medium"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <Select.ItemText>{p}</Select.ItemText>
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

                {/* select categories */}
                <div className="relative col-span-12 overflow-hidden flex flex-col gap-2">
                  <h4 className="">Categories</h4>
                  <Popover.Root
                    onOpenChange={(open) => {
                      if (!open && !selectedSubCategory) {
                        setSelectedCategory(null);
                        setSelectedSubCategory(null);
                        setCategoryPopoverStep(1);
                      }
                    }}
                  >
                    <Popover.Trigger asChild>
                      <div className="inline-flex cursor-pointer items-center w-full justify-between px-4 py-3 bg-white border-slate-300 border rounded  text-sm  ">
                        {" "}
                        {selectedCategory ? (
                          <span>
                            {selectedCategory.name}

                            {selectedSubCategory && (
                              <span className="pl-1">
                                &gt; {selectedSubCategory.name}
                              </span>
                            )}
                          </span>
                        ) : (
                          "Select a category"
                        )}
                        <ChevronDownIcon />
                      </div>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        className="PopoverContent bg-white shadow-xl rounded border  outline-none text-sm"
                        // sideOffset={5}
                        align="start"
                      >
                        <div className="bg-white max-h-60 overflow-y-auto rounded flex flex-col">
                          {/* categories list */}
                          {categoryPopoverStep === 1 && (
                            <>
                              {categories.map((category) => (
                                <div
                                  key={category.id + category.name}
                                  className={`flex items-center  cursor-pointer  px-3 py-2 rounded ${
                                    selectedCategory?.id === category?.id
                                      ? "bg-orange-100 text-orange-400 font-medium"
                                      : "hover:bg-gray-100"
                                  }`}
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    // setSelectedSubCategory(null);
                                    console.log(category);
                                    setCategoryPopoverStep(2);
                                  }}
                                >
                                  <span>{category.name} </span>
                                </div>
                              ))}
                            </>
                          )}
                          {/* subcategories list */}
                          {categoryPopoverStep === 2 && (
                            <>
                              <h6 className="sticky top-0 bg-zinc-50 text-zinc-500 font-light px-5 text-sm  py-1 flex items-center">
                                Select Sub-Category
                              </h6>
                              {subCategories.map((category) => (
                                <Popover.Close
                                  key={category.id}
                                  className="PopoverClose"
                                  aria-label="Close"
                                >
                                  <div
                                    className={`flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded ${
                                      selectedSubCategory?.id === category?.id
                                        ? "bg-orange-100 text-orange-400 font-medium"
                                        : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => {
                                      setSelectedSubCategory(category);
                                      setCategoryPopoverStep(1);
                                      // setSubCategories(null);
                                    }}
                                  >
                                    <span>{category.name} </span>
                                  </div>
                                </Popover.Close>
                              ))}
                            </>
                          )}
                          {/* loader */}
                          {selectedCategory && subCategories.length == 0 && (
                            <div
                              className={` w-full h-40  flex items-center justify-center`}
                            >
                              <svg
                                aria-hidden="true"
                                className={` dark:text-gray-400 animate-spin w-8 h-8  text-gray-200 fill-orange-400 `}
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
                          {/* placeholder element so popover wont disappear when switcing between categories list to sub-categories list */}
                          <span className="w-1 h-1"></span>
                        </div>

                        <Popover.Arrow className="PopoverArrow" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>

                <div className="col-span-12">
                  <label
                    htmlFor="description"
                    className="mb-2 flex w-full justify-between items-center"
                  >
                    <span>Description</span>
                    <span className="text-zinc-500">
                      {description.length}/{descriptionMaxLength}
                    </span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="border border-slate-300 h-40  p-2 rounded w-full"
                  />
                </div>
                <div className="col-span-12">
                  <label
                    htmlFor="description"
                    className="mb-2 flex w-full justify-between items-center"
                  >
                    <span>Tags </span>
                    {tags.length < 2 && (
                      <span className="text-zinc-500">
                        {tags.length}/{2}
                      </span>
                    )}
                  </label>

                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="tags"
                    className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-0"
                  />
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-slate-200  px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(index)}
                          className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* primary image */}
                {/* <div className="relative col-span-12 overflow-hidden flex flex-col gap-2">
                  <h4>Upload Primary Image</h4>
                  
                  <ImageUpload
                    value={primaryImage}
                    onImageChange={(file) => {
                      if (file instanceof File || file === null) {
                        setPrimaryImage(file);
                      }
                    }}
                    allowMultiple={false}
                  />
                </div> */}

                {/* secondary image */}
                {/* <div className="relative col-span-12 overflow-hidden flex flex-col gap-2">
                  <h4>Upload Gallery Images</h4>
                  <div>
                   
                    <ImageUpload
                      value={galleryImages}
                      onImageChange={(file) => {
                        if (Array.isArray(file) || file === null) {
                          setGalleryImages(file);
                        } else if (file instanceof File) {
                          setGalleryImages([file]);
                        }
                      }}
                      allowMultiple={true}
                    />
                  </div>
                </div> */}

                {/* next btn */}
                <button
                  className={`flex w-full justify-center rounded py-4 col-span-12  bg-orange-400  text-white hover:bg-[#FFAB4E] hover:shadow-lg shadow mt-0 font-semibold ${
                    loading ? "animate-pulse cursor-wait " : " opacity-100 "
                  }`}
                >
                  Next
                </button>
              </section>
            )}
          </form>
        </>
      )}
    </div>
  );
}

export default CreatePage;
