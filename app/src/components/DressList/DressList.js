import React, { useState, useEffect, useRef, useMemo } from "react";
import './DressList.css';
import { Link } from 'react-router-dom';
import { fetchDresses } from "../../services/dressService"; 

function DressList() {
    const [allDresses, setAllDresses] = useState([]);
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
        const fetchData = async () => {
            setLoading(true); 
            try {
                const storedDresses = sessionStorage.getItem('dresses');
                const storedColorCounts = sessionStorage.getItem('colorCounts');
                const storedLocationCounts = sessionStorage.getItem('locationCounts');
                const storedTotalCount = sessionStorage.getItem('totalCount');

                if (storedDresses && storedColorCounts && storedLocationCounts && storedTotalCount) {
                    setAllDresses(JSON.parse(storedDresses));
                    setColorCounts(JSON.parse(storedColorCounts));
                    setLocationCounts(JSON.parse(storedLocationCounts));
                    setTotalPages(Math.ceil(JSON.parse(storedTotalCount) / dressesPerPage));
                } else {
                    const data = await fetchDresses();
                    setAllDresses(data.dresses);
                    setColorCounts(data.colorCounts);
                    setLocationCounts(data.locationCounts);
                    setTotalPages(Math.ceil(data.totalCount / dressesPerPage));

                    sessionStorage.setItem('dresses', JSON.stringify(data.dresses));
                    sessionStorage.setItem('colorCounts', JSON.stringify(data.colorCounts));
                    sessionStorage.setItem('locationCounts', JSON.stringify(data.locationCounts));
                    sessionStorage.setItem('totalCount', JSON.stringify(data.totalCount));
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dresses:", error);
                setLoading(false); 
            }
        };

        fetchData();
    }, [dressesPerPage]);

    const filterDresses = (dresses, colorFilter, locationFilter) => {
        return dresses.filter(dress => {
            if (colorFilter && !dress.color.toLowerCase().includes(colorFilter.toLowerCase())) {
                return false;
            }
            if (locationFilter && !dress.location.toLowerCase().includes(locationFilter.toLowerCase())) {
                return false;
            }
            return true;
        });
    };

    const sortDresses = (dresses, sortBy) => {
        if (sortBy === 'price-asc') {
            return dresses.sort((a, b) => a.rentPrice - b.rentPrice);
        } else if (sortBy === 'price-desc') {
            return dresses.sort((a, b) => b.rentPrice - a.rentPrice);
        }
        return dresses;
    };

    const paginateDresses = (dresses, page, limit) => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return dresses.slice(startIndex, endIndex);
    };

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

    const filteredDresses = filterDresses(allDresses, selectedColor, selectedLocation); 
    const sortedDresses = sortDresses(filteredDresses, sort === 'price-high' ? 'price-desc' : sort === 'price-low' ? 'price-asc' : undefined);

    const paginatedDresses = useMemo(() => {
        return paginateDresses(sortedDresses, currentPage, dressesPerPage);
    }, [currentPage, sortedDresses, dressesPerPage]);

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
                        {selectedColor ? selectedColor : "בחר צבע"}
                    </button>
                    <div className={`sort-dropdown ${isColorDropdownOpen ? 'show' : ''}`}>
                        <button onClick={() => { setSelectedColor(""); setIsColorDropdownOpen(false); }}>כל הצבעים</button>
                        {renderDropdown(colors, setSelectedColor, getCount, 'color')}
                    </div>
                </div>

                <div className="sort-container" ref={locationDropdownRef}>
                    <button className="sort-button" onClick={() => handleDropdownToggle('location')}>
                        {selectedLocation ? selectedLocation : "בחר עיר"}
                    </button>
                    <div className={`sort-dropdown ${isLocationDropdownOpen ? 'show' : ''}`}>
                        <button onClick={() => { setSelectedLocation(""); setIsLocationDropdownOpen(false); }}>כל הערים</button>
                        {renderDropdown(locations, setSelectedLocation, getCount, 'location')}
                    </div>
                </div>
            </div>

            <div className="dress-list-container">
                {loading && <p>השמלות בטעינה, אנא המתינו מספר שניות.</p>}
                {!loading && paginatedDresses && paginatedDresses.length > 0 && (
                    paginatedDresses.map((dress) => (
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
                {!loading && (!paginatedDresses || paginatedDresses.length === 0) && (
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