import React, { useState, useEffect } from "react";
import { fetchDresses } from "../../services/dressService";
import './DressList.css';

function DressList() {
    const [dresses, setDresses] = useState([]);

    useEffect(() => {
        const getDresses = async () => {
            try {
                const data = await fetchDresses();
                setDresses(data);
            } catch (error) {
                console.error("Error fetching dresses:", error);
            }
        };
        getDresses();
    }, []);

    return (
        <div>
            <div className="hero-section">
                <h1>שמלות ערב להשכרה</h1>
                <p>קולקציות שמלות ערב להשכרה מכל רחבי הארץ</p>
            </div>
            <div className="row">
                {dresses.map((dress) => (
                    <div className="col-md-4" key={dress._id}>
                        <div className="card">
                            <img
                                src={`http://localhost:5000/uploads/${dress.image}`} 
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
                ))}
            </div>
        </div>
    );
}

export default DressList;