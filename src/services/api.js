import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchWithToken = (endpoint) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await axios.get(`http://localhost:3001/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // eslint-disable-next-line
  }, [endpoint, token]);

  const postData = async (postData) => {
    try {
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await axios.post(`http://localhost:3001/${endpoint}`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setData(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const putData = async (putData, urlParam) => {
    try {
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await axios.put(`http://localhost:3001/${endpoint}/${urlParam}`, putData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setData(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteData = async (urlParam) => {
    try {
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await axios.delete(`http://localhost:3001/${endpoint}/${urlParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setData(response.data); // No data returned after delete
    } catch (error) {
      setError(error.message);
    }
  };

  return { data, error, loading, postData, putData, deleteData };
};

export default useFetchWithToken;
