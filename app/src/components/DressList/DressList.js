import React, { useState, useEffect, useRef } from "react";
import { fetchDresses } from "../../services/dressService";
import './DressList.css';
import { Link } from 'react-router-dom';

function DressList() {
    const [dresses, setDresses] = useState([]);
    const [colorCounts, setColorCounts] = useState([]);
    const [locationCounts, setLocationCounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState("latest");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const dropdownRef = useRef(null);
    const colorDropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);

    useEffect(() => {
        const getDresses = async () => {
            try {
                const response = await fetchDresses(selectedColor, selectedLocation, sort === 'price-low' ? 'price-asc' : sort === 'price-high' ? 'price-desc' : undefined);

                // הוספת השורה הבאה כדי להפוך את סדר השמלות
                const reversedDresses = [...response.dresses].reverse();

                setDresses(reversedDresses);
                setColorCounts(response.colorCounts);
                setLocationCounts(response.locationCounts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dresses:", error);
                setLoading(false);
            }
        };
        getDresses();
    }, [selectedColor, selectedLocation, sort]);

    const getColorCount = (color) => {
        if (!colorCounts) {
            return "(0)";
        }
        const count = colorCounts.find((item) => item._id === color);
        return count ? `(${count.count})` : "(0)";
    };

    const getLocationCount = (location) => {
        if (!locationCounts) {
            return "(0)";
        }
        const count = locationCounts.find((item) => item._id === location);
        return count ? `(${count.count})` : "(0)";
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleColorDropdown = () => setIsColorDropdownOpen(!isColorDropdownOpen);
    const toggleLocationDropdown = () => setIsLocationDropdownOpen(!isLocationDropdownOpen);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    const handleColorClickOutside = (event) => {
        if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target)) {
            setIsColorDropdownOpen(false);
        }
    };

    const handleLocationClickOutside = (event) => {
        if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
            setIsLocationDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("mousedown", handleColorClickOutside);
        document.addEventListener("mousedown", handleLocationClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("mousedown", handleColorClickOutside);
            document.removeEventListener("mousedown", handleLocationClickOutside);
        };
    }, []);

    return (
        <div>
            <div className="hero-section">
                <h1>שמלות ערב להשכרה</h1>
                <p>קולקציות שמלות ערב להשכרה מכל רחבי הארץ</p>
            </div>

            <div className="filter-container">
                <div className="sort-container" ref={dropdownRef}>
                    <button className="sort-button" onClick={toggleDropdown}>
                        מיין לפי {sort === "latest" ? "החדש ביותר" : sort === "price-low" ? "מחיר: נמוך לגבוה" : "מחיר: גבוה לנמוך"}
                    </button>
                    <div className={`sort-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                        <button onClick={() => { setSort("latest"); setIsDropdownOpen(false); }}>החדש ביותר</button>
                        <button onClick={() => { setSort("price-high"); setIsDropdownOpen(false); }}>מחיר: נמוך לגבוה</button>
                        <button onClick={() => { setSort("price-low"); setIsDropdownOpen(false); }}>מחיר: גבוה לנמוך</button>
                    </div>
                </div>

                <div className="sort-container" ref={colorDropdownRef}>
                    <button className="sort-button" onClick={toggleColorDropdown}>
                        צבע {selectedColor ? selectedColor : "בחר צבע"}
                    </button>
                    <div className={`sort-dropdown ${isColorDropdownOpen ? 'show' : ''}`}>
                        <button onClick={() => { setSelectedColor(""); setIsColorDropdownOpen(false); }}>כל הצבעים</button>
                        <button onClick={() => { setSelectedColor("אדום"); setIsColorDropdownOpen(false); }}>אדום {getColorCount("אדום")}</button>
                        <button onClick={() => { setSelectedColor("אפור"); setIsColorDropdownOpen(false); }}>אפור {getColorCount("אפור")}</button>
                        <button onClick={() => { setSelectedColor("בורדו"); setIsColorDropdownOpen(false); }}>בורדו {getColorCount("בורדו")}</button>
                        <button onClick={() => { setSelectedColor("ורוד"); setIsColorDropdownOpen(false); }}>ורוד {getColorCount("ורוד")}</button>
                        <button onClick={() => { setSelectedColor("זהב"); setIsColorDropdownOpen(false); }}>זהב {getColorCount("זהב")}</button>
                        <button onClick={() => { setSelectedColor("חום"); setIsColorDropdownOpen(false); }}>חום {getColorCount("חום")}</button>
                        <button onClick={() => { setSelectedColor("ירוק"); setIsColorDropdownOpen(false); }}>ירוק {getColorCount("ירוק")}</button>
                        <button onClick={() => { setSelectedColor("כחול"); setIsColorDropdownOpen(false); }}>כחול {getColorCount("כחול")}</button>
                        <button onClick={() => { setSelectedColor("כסף"); setIsColorDropdownOpen(false); }}>כסף {getColorCount("כסף")}</button>
                        <button onClick={() => { setSelectedColor("כתום"); setIsColorDropdownOpen(false); }}>כתום {getColorCount("כתום")}</button>
                        <button onClick={() => { setSelectedColor("לבן"); setIsColorDropdownOpen(false); }}>לבן {getColorCount("לבן")}</button>
                        <button onClick={() => { setSelectedColor("סגול"); setIsColorDropdownOpen(false); }}>סגול {getColorCount("סגול")}</button>
                        <button onClick={() => { setSelectedColor("צבעוני"); setIsColorDropdownOpen(false); }}>צבעוני {getColorCount("צבעוני")}</button>
                        <button onClick={() => { setSelectedColor("שחור"); setIsColorDropdownOpen(false); }}>שחור {getColorCount("שחור")}</button>
                        <button onClick={() => { setSelectedColor("שמנת"); setIsColorDropdownOpen(false); }}>שמנת {getColorCount("שמנת")}</button>
                        <button onClick={() => { setSelectedColor("תכלת"); setIsColorDropdownOpen(false); }}>תכלת {getColorCount("תכלת")}</button>
                    </div>
                </div>
                <div className="sort-container" ref={locationDropdownRef}>
                    <button className="sort-button" onClick={toggleLocationDropdown}>
                        עיר {selectedLocation ? selectedLocation : "בחר עיר"}
                    </button>
                    <div className={`sort-dropdown ${isLocationDropdownOpen ? 'show' : ''}`}>
                        <button onClick={() => { setSelectedLocation(""); setIsLocationDropdownOpen(false); }}>כל הערים</button>
                        <button onClick={() => { setSelectedLocation("בני ברק"); setIsLocationDropdownOpen(false); }}>בני ברק {getLocationCount("בני ברק")}</button>
                        <button onClick={() => { setSelectedLocation("אלעד"); setIsLocationDropdownOpen(false); }}>אלעד {getLocationCount("אלעד")}</button>
                        <button onClick={() => { setSelectedLocation("אשקלון"); setIsLocationDropdownOpen(false); }}>אשקלון {getLocationCount("אשקלון")}</button>
                        <button onClick={() => { setSelectedLocation("בית שמש"); setIsLocationDropdownOpen(false); }}>בית שמש {getLocationCount("בית שמש")}</button>
                        <button onClick={() => { setSelectedLocation("ביתר עילית"); setIsLocationDropdownOpen(false); }}>ביתר עילית {getLocationCount("ביתר עילית")}</button>
                        <button onClick={() => { setSelectedLocation("גבעת זאב"); setIsLocationDropdownOpen(false); }}>גבעת זאב {getLocationCount("גבעת זאב")}</button>
                        <button onClick={() => { setSelectedLocation("חולון"); setIsLocationDropdownOpen(false); }}>חולון {getLocationCount("חולון")}</button>
                        <button onClick={() => { setSelectedLocation("חיפה"); setIsLocationDropdownOpen(false); }}>חיפה {getLocationCount("חיפה")}</button>
                        <button onClick={() => { setSelectedLocation("חריש"); setIsLocationDropdownOpen(false); }}>חריש {getLocationCount("חריש")}</button>
                        <button onClick={() => { setSelectedLocation("טבריה"); setIsLocationDropdownOpen(false); }}>טבריה {getLocationCount("טבריה")}</button>
                        <button onClick={() => { setSelectedLocation("ירושלים"); setIsLocationDropdownOpen(false); }}>ירושלים {getLocationCount("ירושלים")}</button>
                        <button onClick={() => { setSelectedLocation("לוד"); setIsLocationDropdownOpen(false); }}>לוד {getLocationCount("לוד")}</button>
                        <button onClick={() => { setSelectedLocation("מודיעין עילית"); setIsLocationDropdownOpen(false); }}>מודיעין עילית {getLocationCount("מודיעין עילית")}</button>
                        <button onClick={() => { setSelectedLocation("נתניה"); setIsLocationDropdownOpen(false); }}>נתניה {getLocationCount("נתניה")}</button>
                        <button onClick={() => { setSelectedLocation("פתח תקווה"); setIsLocationDropdownOpen(false); }}>פתח תקווה {getLocationCount("פתח תקווה")}</button>
                        <button onClick={() => { setSelectedLocation("קרית מלאכי"); setIsLocationDropdownOpen(false); }}>קרית מלאכי {getLocationCount("קרית מלאכי")}</button>
                        <button onClick={() => { setSelectedLocation("ראשון לציון"); setIsLocationDropdownOpen(false); }}>ראשון לציון {getLocationCount("ראשון לציון")}</button>
                        <button onClick={() => { setSelectedLocation("רחובות"); setIsLocationDropdownOpen(false); }}>רחובות {getLocationCount("רחובות")}</button>
                        <button onClick={() => { setSelectedLocation("רכסים"); setIsLocationDropdownOpen(false); }}>רכסים {getLocationCount("רכסים")}</button>
                        <button onClick={() => { setSelectedLocation("רמת השרון"); setIsLocationDropdownOpen(false); }}>רמת השרון {getLocationCount("רמת השרון")}</button>
                        <button onClick={() => { setSelectedLocation("תל אביב"); setIsLocationDropdownOpen(false); }}>תל אביב {getLocationCount("תל אביב")}</button>
                    </div>
                </div>
            </div>

            <div className="dress-list-container">
                {loading ? (
                    <p>השמלות בטעינה, אנא המתינו מספר שניות.</p>
                ) : dresses && dresses.length > 0 ? (
                    dresses.map((dress) => (
                        <div className="card" key={dress._id}>
                            <img src={dress.image} className="card-img-top" alt={dress.name} />
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