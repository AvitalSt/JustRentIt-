import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const loginAdmin = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        return response.data; 
    } catch (error) {
        throw error; 
    }
};