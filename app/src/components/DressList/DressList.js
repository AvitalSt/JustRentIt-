import React, { useState, useEffect } from "react";
import { fetchDresses } from "../../services/dressService";
import './DressList.css';

function DressList() {
    const [dresses, setDresses] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const getDresses = async () => {
            try {
                const data = await fetchDresses();
                setDresses(data);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching dresses:", error);
                setLoading(false); // Set loading to false even in case of error
            }
        };
        getDresses();
    }, []);

    const API_URL = process.env.REACT_APP_API_URL;

    return (
        <div>
            <div className="hero-section">
                <h1>שמלות ערב להשכרה</h1>
                <p>קולקציות שמלות ערב להשכרה מכל רחבי הארץ</p>
            </div>
            <div className="row">
                {loading ? (
                    <p>Loading dresses...</p> // Show loading message while fetching data
                ) : dresses.length > 0 ? (
                    dresses.map((dress) => (
                        <div className="col-md-4" key={dress._id}>
                            <div className="card">
                                <img
                                    src={`${API_URL}/uploads/${dress.image}`}
                                    className="card-img-top"
                                    alt={dress.name}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{dress.name}</h5>
                                    <p className="card-text">{dress.description}</p>
                                    <p className="card-price">מחיר: {dress.rentPrice} ₪</p>
                                    <a href={`/dress/${dress._id}`} className="btn btn-primary">למידע נוסף</a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No dresses found.</p> // Show message if no dresses are found
                )}
            </div>
        </div>
    );
}

export default DressList;