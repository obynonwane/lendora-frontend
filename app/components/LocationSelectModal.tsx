import React, { useEffect, useState } from "react";
import axios from "axios";

function LocationSelectModal(
  {
    // selectedState,
    // setSelectedState,
    // setIsShowSelectStateModal,
    // allStates,
  }
) {
  // console.log(
  //   selectedState,
  //   setSelectedState,
  //   setIsShowSelectStateModal,
  //   allStates
  // );

  type DataType = {
    // Define the expected shape of your response data here
    id: number;
    name: string;
  };

  const [data, setData] = useState<DataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataType[]>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/states`
        );
        setData(response.data);
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
        // onClick={() => setIsShowSelectStateModal(false)}
        className=" fixed z-[299] cursor-pointer inset-0 bg-black/50"
      ></div>
      <div className="bg-[#EBF2F7] z-[300] fixed lendora-modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[80%] h-[90%] md:h-[80%] overflow-x-hidden rounded-md">
        SelectStateCityModal
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {data && (
          <ul>
            {data.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default LocationSelectModal;
