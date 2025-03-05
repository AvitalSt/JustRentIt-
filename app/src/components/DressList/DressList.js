import React, { useState, useEffect, useRef } from "react";
import { fetchDresses } from "../../services/dressService";
import './DressList.css';
import { Link } from 'react-router-dom';

function DressList() {
    const [dresses, setDresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState("latest");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const getDresses = async () => {
            try {
                const data = await fetchDresses();
                setDresses(data);
            } catch (error) {
                console.error("Error fetching dresses:", error);
            } finally {
                setLoading(false);
            }
        };
        getDresses();
    }, []);

    const API_URL = process.env.REACT_APP_API_URL;

    const sortedDresses = [...dresses].sort((a, b) => {
        if (sort === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sort === "price-low") return a.rentPrice - b.rentPrice;
        if (sort === "price-high") return b.rentPrice - a.rentPrice;
        return 0;
    });

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className="hero-section">
                <h1>שמלות ערב להשכרה</h1>
                <p>קולקציות שמלות ערב להשכרה מכל רחבי הארץ</p>
            </div>

            <div className="sort-container" ref={dropdownRef}>
                <button className="sort-button" onClick={toggleDropdown}>
                    מיין לפי {sort === "latest" ? "החדש ביותר" : sort === "price-low" ? "מחיר: נמוך לגבוה" : "מחיר: גבוה לנמוך"}
                </button>
                <div className={`sort-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                    <button onClick={() => { setSort("latest"); setIsDropdownOpen(false); }}>החדש ביותר</button>
                    <button onClick={() => { setSort("price-low"); setIsDropdownOpen(false); }}>מחיר: נמוך לגבוה</button>
                    <button onClick={() => { setSort("price-high"); setIsDropdownOpen(false); }}>מחיר: גבוה לנמוך</button>
                </div>
            </div>

            <div className="dress-list-container">
                {loading ? (
                    <p>Loading dresses...</p>
                ) : sortedDresses.length > 0 ? (
                    sortedDresses.map((dress) => (
                        <div className="card" key={dress._id}>
                            <img
                                src={`/uploads/${dress.image}`} // שינוי כאן
                                className="card-img-top"
                                alt={dress.name}
                            />
                            <div className="card-body">
                                <h5 className="card-title card-title-highlight">{dress.name}</h5>
                                <p className="card-text card-text-italic">{dress.description}</p>
                                <p className="card-price">מחיר: {dress.rentPrice} ₪</p>
                                <Link to={`/dress/${dress._id}`} className="btn btn-secondary">למידע נוסף</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No dresses found.</p>
                )}
            </div>
        </div>
    );
}

export default DressList;