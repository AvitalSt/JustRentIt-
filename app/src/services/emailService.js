import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// export const interestDressEmail = async (formPayload) => {
//     try {
//         const response = await axios.post(`${API_URL}/interest-dress-Email`, formPayload);
//         return response;
//     } catch (error) {
//         throw new Error("Error sending email: " + error);
//     }
// };

export const interestDressEmail = async (formPayload) => {
    try {
        const response = await axios.post(`${API_URL}/interest-dress-Email`, formPayload);
        return response;
    } catch (error) {
        const status = error.response ? error.response.status : 'N/A';
        const serverErrorMsg = error.response?.data?.error || 'שגיאה לא ידועה';
        
        throw new Error(`שגיאת שרת ${status}: השרת נכשל בשליחת המייל. (${serverErrorMsg})`);
    }
};

export const addDressEmail = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/add-dress-Email`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error sending email: " + error);
    }
};

export const sendCatalogEmail = async (formPayload) => {
    try {
        const response = await axios.post(`${API_URL}/send-catalog-Email`, formPayload);
        return response;
    } catch (error) {
        throw new Error("שגיאה בשליחת המייל: " + error.message);
    }
};