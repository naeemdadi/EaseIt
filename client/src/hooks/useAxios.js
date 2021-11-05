import axios from "axios";
import { useEffect, useState } from "react";

export const useAxios = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const apiCall = async ({ type, url, body }) => {
    try {
      setLoading(true);
      const res = await axios[type](url, body);
      setResponse(res.data);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiCall();
  }, []);

  return { apiCall, response, loading, error };
};
