import { useEffect, useState } from "react";

const useUserCity = () => {
  const [userCity, setUserCity] = useState(null);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        if (data?.city) {
          setUserCity(data.city);
        }
      } catch (err) {
        console.error("Failed to fetch user city", err);
      }
    };

    fetchCity();
  }, []);

  return userCity;
};

export default useUserCity;
