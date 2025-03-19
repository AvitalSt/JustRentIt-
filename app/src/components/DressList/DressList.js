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
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const colorDropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dressesPerPage] = useState(16);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const getDresses = async () => {
            try {
                setLoading(true);
                const response = await fetchDresses(selectedColor, selectedLocation, sort === 'price-high' ? 'price-desc' : sort === 'price-low' ? 'price-asc' : undefined, currentPage, dressesPerPage);
                setDresses(response.dresses);
                setColorCounts(response.colorCounts);
                setLocationCounts(response.locationCounts);
                setTotalPages(Math.ceil(response.totalCount / dressesPerPage));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dresses:", error);
                setLoading(false);
            }
        };
        getDresses();
    }, [selectedColor, selectedLocation, sort, currentPage, dressesPerPage]);

    const getCount = (array, id) => {
        const count = array.find((item) => item._id === id);
        return count ? `(${count.count})` : "(0)";
    };

    const handleDropdownToggle = (dropdown) => {
        if (dropdown === "sort") setIsDropdownOpen(!isDropdownOpen);
        if (dropdown === "color") setIsColorDropdownOpen(!isColorDropdownOpen);
        if (dropdown === "location") setIsLocationDropdownOpen(!isLocationDropdownOpen);
    };

    const handleClickOutside = (event, dropdown) => {
        if (dropdown === "sort" && dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
        if (dropdown === "color" && colorDropdownRef.current && !colorDropdownRef.current.contains(event.target)) setIsColorDropdownOpen(false);
        if (dropdown === "location" && locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) setIsLocationDropdownOpen(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", (event) => handleClickOutside(event, "sort"));
        document.addEventListener("mousedown", (event) => handleClickOutside(event, "color"));
        document.addEventListener("mousedown", (event) => handleClickOutside(event, "location"));

        return () => {
            document.removeEventListener("mousedown", (event) => handleClickOutside(event, "sort"));
            document.removeEventListener("mousedown", (event) => handleClickOutside(event, "color"));
            document.removeEventListener("mousedown", (event) => handleClickOutside(event, "location"));
        };
    }, []);

    const colors = ["אדום", "אפור", "בורדו", "ורוד", "זהב", "חום", "ירוק", "כחול", "כסף", "כתום", "לבן", "סגול", "צבעוני", "שחור", "שמנת", "תכלת"];
    const locations = [
        "בני-ברק", "אלעד", "אשקלון", "בית-שמש", "ביתר-עילית",
        "גבעת-זאב", "חולון", "חיפה", "חריש", "טבריה",
        "ירושלים", "לוד", "מודיעין-עילית", "נתניה", "פתח-תקווה",
        "קרית-מלאכי", "ראשון-לציון", "רחובות", "רכסים",
        "רמת-השרון", "תל-אביב"
      ];
    const renderDropdown = (list, setSelected, getCount, type) => (
        list.map(item => (
            <button key={item} onClick={() => { setSelected(item); handleDropdownToggle(type); }}>
                {item} {getCount(type === 'color' ? colorCounts : locationCounts, item)}
            </button>
        ))
    );

    return (
        <div>
            <div className="hero-section">
                <h1>שמלות ערב להשכרה</h1>
                <p>קולקציות שמלות ערב להשכרה מכל רחבי הארץ</p>
            </div>

            <div className="filter-container">
                <div className="sort-container" ref={dropdownRef}>
                    <button className="sort-button" onClick={() => handleDropdownToggle('sort')}>
                        מיין לפי {sort === "latest" ? "החדש ביותר" : sort === "price-low" ? "מחיר: נמוך לגבוה" : "מחיר: גבוה לנמוך"}
                    </button>
                    <div className={`sort-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                        <button onClick={() => { setSort("latest"); setIsDropdownOpen(false); }}>החדש ביותר</button>
                        <button onClick={() => { setSort("price-low"); setIsDropdownOpen(false); }}>מחיר: נמוך לגבוה</button>
                        <button onClick={() => { setSort("price-high"); setIsDropdownOpen(false); }}>מחיר: גבוה לנמוך</button>
                    </div>
                </div>

                <div className="sort-container" ref={colorDropdownRef}>
                    <button className="sort-button" onClick={() => handleDropdownToggle('color')}>
                        צבע {selectedColor || "בחר צבע"}
                    </button>
                    <div className={`sort-dropdown ${isColorDropdownOpen ? 'show' : ''}`}>
                        <button onClick={() => { setSelectedColor(""); setIsColorDropdownOpen(false); }}>כל הצבעים</button>
                        {renderDropdown(colors, setSelectedColor, getCount, 'color')}
                    </div>
                </div>

                <div className="sort-container" ref={locationDropdownRef}>
                    <button className="sort-button" onClick={() => handleDropdownToggle('location')}>
                        עיר {selectedLocation || "בחר עיר"}
                    </button>
                    <div className={`sort-dropdown ${isLocationDropdownOpen ? 'show' : ''}`}>
                        <button onClick={() => { setSelectedLocation(""); setIsLocationDropdownOpen(false); }}>כל הערים</button>
                        {renderDropdown(locations, setSelectedLocation, getCount, 'location')}
                    </div>
                </div>
            </div>

            <div className="dress-list-container">
                {loading && <p>השמלות בטעינה, אנא המתינו מספר שניות.</p>}
                {!loading && dresses && dresses.length > 0 && (
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
                )}
                {!loading && (!dresses || dresses.length === 0) && (
                    <p>No dresses found.</p>
                )}

            </div>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)} className={currentPage === page ? 'active' : ''}>
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DressList;