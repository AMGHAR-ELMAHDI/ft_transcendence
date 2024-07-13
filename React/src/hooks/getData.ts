import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

function fetchData(url: string) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(url);
        setData(response.data);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        toast.error("Cant get User Data", { id: "Cant get User Data" });
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
export default fetchData;
