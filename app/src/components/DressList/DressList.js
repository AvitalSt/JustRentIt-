import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import './DressList.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchDresses } from "../../services/dressService";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function DressList() {
    const [allDresses, setAllDresses] = useState([]);
    const [colorCounts, setColorCounts] = useState([]);
    const [locationCounts, setLocationCounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState("החדש ביותר");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const colorDropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);
    const query = useQuery();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(() => {
        const storedState = sessionStorage.getItem('lastListState');
        return storedState ? JSON.parse(storedState).page : 1;
    });
    const [dressesPerPage] = useState(16);
    const [totalPages, setTotalPages] = useState(1);

    const filterDresses = useCallback((dresses, colorFilter, locationFilter) => {
        return dresses.filter(dress => {
            if (colorFilter && !dress.color.toLowerCase().includes(colorFilter.toLowerCase())) {
                return false;
            }
            if (locationFilter && !dress.location.toLowerCase().includes(locationFilter.toLowerCase())) {
                return false;
            }
            return true;
        });
    }, []);

    useEffect(() => {
        const pageFromUrl = query.get("page");
        const colorFromUrl = query.get("color");
        const locationFromUrl = query.get("location");

        if (pageFromUrl && parseInt(pageFromUrl, 10) !== currentPage) {
            setCurrentPage(parseInt(pageFromUrl, 10));
        }
        if (colorFromUrl) {
            setSelectedColor(colorFromUrl);
        }
        if (locationFromUrl) {
            setSelectedLocation(locationFromUrl);
        }
    }, [query, currentPage, setSelectedColor, setSelectedLocation]);

    useEffect(() => {
        sessionStorage.removeItem('lastListState');
    }, [query]);

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

    const filteredDresses = useMemo(() => {
        return filterDresses(allDresses, selectedColor, selectedLocation);
    }, [allDresses, selectedColor, selectedLocation, filterDresses]);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredDresses.length / dressesPerPage));
        setCurrentPage(1);
    }, [filteredDresses, dressesPerPage]);

    const sortedDresses = useMemo(() => {
        const dressesToSort = [...filteredDresses];
        if (sort === 'מחיר: נמוך לגבוה') {
            return dressesToSort.sort((a, b) => a.rentPrice - b.rentPrice);
        } else if (sort === 'מחיר: גבוה לנמוך') {
            return dressesToSort.sort((a, b) => b.rentPrice - a.rentPrice);
        }
        return dressesToSort;
    }, [filteredDresses, sort]);

    const paginateDresses = useCallback((dresses, page, limit) => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return dresses.slice(startIndex, endIndex);
    }, []);

    const paginatedDresses = useMemo(() => {
        return paginateDresses(sortedDresses, currentPage, dressesPerPage);
    }, [currentPage, sortedDresses, dressesPerPage, paginateDresses]);

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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const handleNavigateToDetail = (dressId) => {
        sessionStorage.setItem('lastListState', JSON.stringify({ page: currentPage, color: selectedColor, location: selectedLocation }));
        navigate(`/dress/${dressId}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const params = new URLSearchParams();
        params.append('page', page);
        if (selectedColor) params.append('color', selectedColor);
        if (selectedLocation) params.append('location', selectedLocation);
        navigate(`/dresses?${params.toString()}`);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setCurrentPage(1);
        const params = new URLSearchParams();
        params.append('page', 1);
        if (color) params.append('color', color);
        if (selectedLocation) params.append('location', selectedLocation);
        navigate(`/dresses?${params.toString()}`);
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setCurrentPage(1);
        const params = new URLSearchParams();
        params.append('page', 1);
        if (selectedColor) params.append('color', selectedColor);
        if (location) params.append('location', location);
        navigate(`/dresses?${params.toString()}`);
    };

    const handleSortSelect = (selectedSort) => {
        setSort(selectedSort);
        setIsDropdownOpen(false);
    };

    const colors = ["אדום", "אפור", "בורדו", "ורוד", "זהב", "חום", "ירוק", "כחול", "כסף", "כתום", "לבן", "סגול", "צבעוני", "שחור", "שמנת", "תכלת"];
    const locations = [
        "בני-ברק", "אלעד", "אשקלון", "בית-שמש", "ביתר-עילית",
        "גבעת-זאב", "חולון", "חיפה", "חריש", "טבריה",
        "ירושלים", "לוד", "מודיעין-עילית", "נתניה", "פתח-תקווה",
        "קרית-מלאכי", "ראשון-לציון", "רחובות", "רכסים",
        "רמת-השרון", "תל-אביב"
    ];

    const renderDropdown = (list, setSelected, getCount, type) => (
        <div ref={type === 'sort' ? dropdownRef : type === 'color' ? colorDropdownRef : locationDropdownRef} className={`sort-dropdown ${type === 'sort' ? (isDropdownOpen ? 'show' : '') : type === 'color' ? (isColorDropdownOpen ? 'show' : '') : (isLocationDropdownOpen ? 'show' : '')}`}>
            {type === 'color' && <button onClick={() => handleColorSelect('')}>כל הצבעים</button>}
            {type === 'location' && <button onClick={() => handleLocationSelect('')}>כל הערים</button>}
            {list.map(item => (
                <button key={item} onClick={() => {
                    if (type === 'color') handleColorSelect(item);
                    else if (type === 'location') handleLocationSelect(item);
                    else handleSortSelect(item);
                    handleDropdownToggle(type);
                }}>
                    {item} {getCount(type === 'color' ? colorCounts : locationCounts, item)}
                </button>
            ))}
        </div>
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
                        מיין לפי {sort}
                    </button>
                    {renderDropdown(['החדש ביותר', 'מחיר: נמוך לגבוה', 'מחיר: גבוה לנמוך'], setSort, () => '', 'sort')}
                </div>

                <div className="sort-container" ref={colorDropdownRef}>
                    <button className="sort-button" onClick={() => handleDropdownToggle('color')}>
                        {selectedColor ? selectedColor : "בחר צבע"}
                    </button>
                    {renderDropdown(colors, setSelectedColor, getCount, 'color')}
                </div>

                <div className="sort-container" ref={locationDropdownRef}>
                    <button className="sort-button" onClick={() => handleDropdownToggle('location')}>
                        {selectedLocation ? selectedLocation : "בחר עיר"}
                    </button>
                    {renderDropdown(locations, setSelectedLocation, getCount, 'location')}
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
                                <Link
                                    to={`/dress/${dress._id}`}
                                    className="btn btn-secondary"
                                    onClick={() => handleNavigateToDetail(dress._id)}
                                >
                                    למידע נוסף
                                </Link>
                            </div>
                        </div>
                    ))
                )}
                {!loading && (!paginatedDresses || paginatedDresses.length === 0) && (
                    <p>לא נמצאו שמלות התואמות לסינון.</p>
                )}
            </div>
            <div className="pagination">
                <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                    {'<'}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                        if (totalPages <= 5) {
                            return true;
                        }
                        if (currentPage <= 3) {
                            return page <= 5;
                        }
                        if (currentPage >= totalPages - 2) {
                            return page > totalPages - 5;
                        }
                        return page >= currentPage - 2 && page <= currentPage + 2;
                    })
                    .map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? 'active' : ''}
                        >
                            {page}
                        </button>
                    ))}
                <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                    {'>'}
                </button>
                <span className="total-pages">סך הכל {totalPages} עמודים</span>
            </div>
        </div>
    );
}

export default DressList;