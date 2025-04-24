import React from "react";
import './DressList.css'; 
import { Link, useNavigate } from 'react-router-dom';

function DressCard({ dress }) {
    const navigate = useNavigate();

    const handleNavigateToDetail = (dressId) => {
        sessionStorage.setItem('lastListState', JSON.stringify({
            page: parseInt(new URLSearchParams(window.location.search).get('page') || '1', 10),
            color: new URLSearchParams(window.location.search).get('color') || '',
            location: new URLSearchParams(window.location.search).get('location') || ''
        }));
        navigate(`/dress/${dressId}`);
    };

    return (
        <div className="card">
            <img src={dress.image} className="card-img-top" alt={dress.name} />
            <div className="card-body">
                <h5 className="card-title card-title-highlight">{dress.name}</h5>
                <p className="card-text card-text-italic">{dress.description}</p>
                <p className="card-price">מחיר: {dress.rentPrice} ₪</p>
                <Link
                    to={`/dress/${dress._id}`}
                    className="btn btn-secondary"
                    onClick={() => handleNavigateToDetail(dress._id)}
                >
                    למידע נוסף
                </Link>
            </div>
        </div>
    );
}

export default DressCard;