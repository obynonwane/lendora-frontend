import { useState } from "react";
import { IoLocation } from "react-icons/io5";
import { RiUserSmileFill } from "react-icons/ri";
import Link from "next/link";
import { ProductPageProduct } from "@/app/types";
import BookingModal from "./BookingModal";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaPhoneVolume } from "react-icons/fa";
import { structureRentalDuration } from "@/app/utils/structureRentalDuration";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Popover } from "radix-ui";
import PurchaseModal from "./PurchaseModal";
function ProductPageSidebar({ product }: { product: ProductPageProduct }) {
  // console.log(product);
  const [isShowBookingModal, setIsShowBookingModal] = useState(false);
  const [isShowPurchaseModal, setIsShowPurchaseModal] = useState(false);
  const [isShowActionRequiredModal, setIsShowActionRequiredModal] =
    useState(false);

  const isRental = product.inventory.product_purpose === "rental";
  const primaryActionButtonClassName = `flex w-full justify-center rounded font-semibold bg-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg shadow text-white  py-3`;
  const maxQuantity = product.inventory.quantity;

  const [quantity, setQuantity] = useState<number>(1);

  const handleIncrementQuantity = () => {
    if (quantity === product.inventory.quantity) {
      // alert(quantity);

      return;
    }
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementDecrementControl = () => {
    return (
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
    );
  };

  const actionRequiredModal = () => {
    return (
      <div
        onClick={() => setIsShowActionRequiredModal(false)}
        className="flex z-[300999999999900] fixed lendora-modal inset-0 items-center p-5 bg-black/50"
      >
        <div className="bg-white  flex flex-col  p-5 overflow-x-hidden rounded-md m-auto md:w-[500px]">
          You need to book the item before you can chat or contact the renter.
        </div>{" "}
      </div>
    );
  };
  return (
    <>
      {isShowActionRequiredModal && actionRequiredModal()}
      {isShowBookingModal && (
        <BookingModal
          handleIncrementQuantity={handleIncrementQuantity}
          handleDecrementQuantity={handleDecrementQuantity}
          quantity={quantity}
          setIsShowBookingModal={setIsShowBookingModal}
          product={product}
        />
      )}
      {isShowPurchaseModal && (
        <PurchaseModal
          handleIncrementQuantity={handleIncrementQuantity}
          handleDecrementQuantity={handleDecrementQuantity}
          quantity={quantity}
          setIsShowPurchaseModal={setIsShowPurchaseModal}
          product={product}
        />
      )}

      <div className="lg:col-span-1 ">
        <div className="sticky top-36 mt-3  rounded  ">
          <div className="bg-white p-3 rounded border ">
            <div className="text-xs  capitalize overflow-hidden flex flex-wrap items-center gap-3  py-2">
              <span className="lg:py-1 px-2 rounded-full border-orange-400 border  bg-white">
                {product.inventory.product_purpose}
              </span>{" "}
              {isRental && product.inventory.negotiable === "yes" && (
                <span className="lg:py-1 px-2 rounded-full border-orange-400 border  bg-white">
                  Negotiable
                </span>
              )}
            </div>
            <p className=" flex gap-2 items-end mt-3">
              <span className="text-3xl  font-bold text-black">
                ₦{product.inventory.offer_price.toLocaleString()}
              </span>
              {isRental && (
                <span className="flex items-center   ">
                  <span className="text-sm ">
                    /per{" "}
                    {structureRentalDuration(product.inventory.rental_duration)}
                  </span>
                </span>
              )}
            </p>
            {isRental && (
              <p className=" flex gap-2 items-end mt-1">
                <span className="flex items-center  text-orange-400  font-semibold">
                  <span className="md:text-xl text-lg mr-1">+</span>
                  <span className="md:text-base text-sm ">
                    {product.inventory.security_deposit.toLocaleString()}
                    (Security Deposit)
                  </span>

                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button
                        className="IconButton text-slate-500 ml-2 "
                        aria-label="Update dimensions"
                      >
                        <IoMdInformationCircleOutline />
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        className="PopoverContent text-slate-700 text-sm z-[9999999999999999999] shadow-xl border bg-white"
                        sideOffset={5}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            // gap: 1,
                          }}
                        >
                          <div
                            className="w-full   text-left rounded"
                            aria-label="Close"
                          >
                            This is refundable!
                          </div>
                        </div>
                        {/* <Popover.Close className="PopoverClose" aria-label="Close">
                    x
                  </Popover.Close> */}
                        <Popover.Arrow className="PopoverArrow" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </span>
              </p>
            )}
            {/* {product.inventory.is_available === "no" ? (
              <>
                <span className="text-center block mt-5 text-red-500 font-bold">
                  THIS ITEM IS CURRENTLY UNAVAILABLE
                </span>
                <span
                  className={` block w-full justify-center rounded font-semibold bg-zinc-500 text-center cursor-not-allowed text-white mt-2 py-3 `}
                >
                  UNAVAILABLE
                </span>
              </>
            ) : (
              <div className="flex gap-2 items-stretch  mt-5">
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
                  onClick={() => setIsShowBookingModal(true)}
                  className={`flex w-full justify-center rounded font-semibold bg-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg shadow text-white  py-3 `}
                >
                  Book Now!
                </button>
              </div>
            )} */}
            {product.inventory.is_available === "no" && (
              <>
                <span className="text-center block mt-5 text-red-500 font-bold">
                  THIS ITEM IS CURRENTLY UNAVAILABLE
                </span>
                <span
                  className={` block w-full justify-center rounded font-semibold bg-zinc-500 text-center cursor-not-allowed text-white mt-2 py-3 `}
                >
                  UNAVAILABLE
                </span>
              </>
            )}
            {product.inventory.is_available === "yes" && isRental && (
              <>
                <div className="flex gap-2 items-stretch  mt-5">
                  {incrementDecrementControl()}
                  <button
                    onClick={() => setIsShowBookingModal(true)}
                    className={primaryActionButtonClassName}
                  >
                    Book Now!
                  </button>
                </div>
              </>
            )}
            {product.inventory.is_available === "yes" && !isRental && (
              <>
                <div className="flex gap-2 items-stretch  mt-5">
                  {incrementDecrementControl()}
                  <button
                    onClick={() => setIsShowPurchaseModal(true)}
                    className={primaryActionButtonClassName}
                  >
                    Buy Now!
                  </button>
                </div>
              </>
            )}

            <div className="grid grid-cols-12 gap-3 mt-3">
              <button
                onClick={() => setIsShowActionRequiredModal(true)}
                className={`flex w-full col-span-6  items-center gap-2 justify-center rounded font-medium text-sm border border-orange-400 hover:bg-[#fff8ef]  hover:shadow-lg shadow   py-2 `}
              >
                <IoChatbubbleEllipsesOutline />
                Chat{" "}
              </button>{" "}
              <button
                onClick={() => setIsShowActionRequiredModal(true)}
                className={`flex w-full col-span-6  items-center gap-2 justify-center rounded font-medium text-sm border border-orange-400 hover:bg-[#fff8ef]  hover:shadow-lg shadow   py-2 `}
              >
                <FaPhoneVolume />
                Contact{" "}
              </button>
            </div>
            <div className="flex mt-6 border-t pt-3">
              <IoLocation className="text-slate-500 text-xl flex-shrink-0" />{" "}
              <span className="text-sm ">
                 Levittown, New York, Brooklyn, New York, Bronx, New York
                 Levittown, New York, Brooklyn, New York, Bronx, New York
              </span>
            </div>
            <div className="flex mt-3 border-t pt-3 gap-2">
              <RiUserSmileFill className="text-orange-400 text-5xl" />
              <p className="text-slate-500 ">
                <span className="font-semibold block text-slate-700 ">
                  {product.user.first_name + " " + product.user.last_name}
                </span>
                <span className="text-sm block">1y 1m on Lendora</span>
              </p>
            </div>
          </div>

          <div className=" bg-white p-3 rounded  mt-5 border">
            <Link
              href={`/create`}
              className={`flex w-full justify-center rounded font-semibold border border-orange-400 hover:bg-[#FFAB4E]  hover:shadow-lg hover:text-white text-sm shadow text-orange-400  py-2 `}
            >
              Post an Ad like this!
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPageSidebar;
