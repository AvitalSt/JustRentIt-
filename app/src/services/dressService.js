// src/services/dressService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchDresses = async () => {
    const response = await fetch(`${API_URL}/dresses`);
    return response.json();
};

export const addDress = async (formData) => {
  try {
      const response = await axios.post(`${API_URL}/dresses`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      return response.data;
  } catch (error) {
      throw error;
  }
};

export const getDressDetails = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/dresses/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Error fetching dress details: " + error);
    }
};