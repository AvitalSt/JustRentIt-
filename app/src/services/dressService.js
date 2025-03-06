import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchDresses = async (color, location, sortBy) => {
    try {
        let url = `${API_URL}/dresses`;
        const params = new URLSearchParams();
        if (color) {
            params.append('color', color);
        }
        if (location) { 
            params.append('location', location);
        }
        if (sortBy) {
            params.append('sortBy', sortBy);
        }
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
        const response = await axios.get(url);
        return response.data; 
    } catch (error) {
        console.error("Error fetching dresses:", error);
        throw error;
    }
};

export const addDress = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/dresses`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
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