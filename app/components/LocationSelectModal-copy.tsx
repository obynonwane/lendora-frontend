import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

function LocationSelectModal({
  selectedState,
  setSelectedState,
  setIsShowSelectStateModal,
}) {
  // console.log(
  //   selectedState,
  //   setSelectedState,
  //   setIsShowSelectStateModal,
  //   allStates
  // );

  type DataType = {
    id: string;
    code: string;
    name: string;
    created_at: string;
    updated_at: string;
  };

  type Country = {
    id: string;
    code: string;
    name: string;
    created_at: string;
    updated_at: string;
  };

  type ApiResponse = {
    error: boolean;
    message: string;
    status_code: number;
    data: Country[];
  };

  const [data, setData] = useState<Country[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/countries`
        );

        setData(response.data.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div
        onClick={() => setIsShowSelectStateModal(false)}
        className=" fixed z-[299] cursor-pointer inset-0 bg-black/50"
      ></div>
      <div className="bg-[#EBF2F7] z-[300] fixed lendora-modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[80%] h-[90%] md:h-[80%] overflow-x-hidden rounded-md">
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {/* Countries */}
        <div className="px-5 mt-3">
          <h4 className=" text-lg font-medium">Countries</h4>
          {data && (
            <p className="flex gap-5  py-2">
              {data.map((item) => (
                <button
                  className="bg-black/5 hover:bg-black/10 p-2 rounded w-full"
                  key={item.id}
                >
                  {item.name}
                </button>
              ))}
            </p>
          )}
        </div>

        {/* states */}
        <div className="px-5 mt-3">
          <h4 className=" text-lg font-medium">States</h4>
          {data && (
            <p className="flex gap-5  py-2">
              {data.map((item) => (
                <button
                  className="bg-black/5 hover:bg-black/10 p-2 rounded w-full"
                  key={item.id}
                >
                  {item.name}
                </button>
              ))}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default LocationSelectModal;
