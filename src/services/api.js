import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchWithToken = (endpoint) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const apiUrl = process.env.API_URL || 'http://localhost:3001'; 

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await axios.get(`${apiUrl}/${endpoint}`, {
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
      const response = await axios.post(`${apiUrl}/${endpoint}`, postData, {
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

  const postFormData = async (formData, endpoint) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      
      const response = await axios.post(`${apiUrl}/${endpoint}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to upload data');
    }
  };
  const putFormData = async (formData, endpoint) => {
    console.log("fff", formData)
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      
      const response = await axios.put(`${apiUrl}/${endpoint}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to upload data');
    }
  };
  
  const putData = async (putData, urlParam) => {
    console.log("url",urlParam)
    try {
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await axios.put(`${apiUrl}/${endpoint}/${urlParam}`, putData, {
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
      const response = await axios.delete(`${apiUrl}/${endpoint}/${urlParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setData(response.data); // No data returned after delete
    } catch (error) {
      setError(error.message);
    }
  };

  return { data, error, loading, postData, putData, deleteData, postFormData , putFormData};
};

export default useFetchWithToken;
