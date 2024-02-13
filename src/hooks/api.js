import { useEffect, useState } from "react";

const DataFetch = ({ url, token }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError("Error al obtener datos");
      }

      setLoading(false);
    } catch (error) {
      setError("Error en la solicitud");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, token]);

  const refetchData = () => {
    setLoading(true); 
    setError(null); 
    fetchData();
  };

  return { data, loading, error, refetchData };
};

export default DataFetch;
