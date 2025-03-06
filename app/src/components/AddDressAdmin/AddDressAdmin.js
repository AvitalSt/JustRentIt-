import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDress } from '../../services/dressService';
import './AddDressAdmin.css';

function AddDressAdmin() {
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [location, setLocation] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [rentPrice, setRentPrice] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // state עבור מצב שליחה

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // ניתוב לדף התחברות אם אין טוקן
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // אימות נתונים בצד הלקוח (דוגמה)
        if (!name || !size || !color || !location || !buyPrice || !rentPrice || !image) {
            setMessage('אנא מלא את כל השדות.');
            return;
        }

        setIsSubmitting(true); // עדכון state שליחה

        const formData = new FormData();
        formData.append('name', name);
        formData.append('size', size);
        formData.append('color', color);
        formData.append('location', location);
        formData.append('buyPrice', buyPrice);
        formData.append('rentPrice', rentPrice);
        formData.append('image', image);

        try {
            await addDress(formData);
            setMessage('השמלה נוספה בהצלחה!');
            setName('');
            setSize('');
            setColor('');
            setLocation('');
            setBuyPrice('');
            setRentPrice('');
            setImage(null);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // שגיאת אימות נתונים מהשרת
                setMessage(error.response.data.error || 'שגיאה בנתונים. אנא בדוק את הקלט שלך.');
            } else if (error.message === 'Network Error') {
                setMessage('שגיאת רשת. נסה שוב מאוחר יותר.');
            } else {
                setMessage(error.response?.data?.error || 'שגיאה בהוספת השמלה. נסה שוב.');
            }
        } finally {
            setIsSubmitting(false); // עדכון state שליחה
        }
    };

    return (
        <div className="add-dress-container">
            <h2>הוספת שמלה</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="שם" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="מידה" value={size} onChange={(e) => setSize(e.target.value)} />
                <input type="text" placeholder="צבע" value={color} onChange={(e) => setColor(e.target.value)} />
                <input type="text" placeholder="מיקום" value={location} onChange={(e) => setLocation(e.target.value)} />
                <input type="number" placeholder="מחיר קנייה" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
                <input type="number" placeholder="מחיר השכרה" value={rentPrice} onChange={(e) => setRentPrice(e.target.value)} />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'שולח...' : 'הוסף שמלה'}
                </button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default AddDressAdmin;