import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchDresses } from "../../services/dressService";
import DressListFilters from "./DressListFilters";
import DressListGrid from "./DressListGrid";
import Pagination from "./Pagination";
import './DressList.css'; 

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function DressListPage() {
    const [allDresses, setAllDresses] = useState([]);
    const [colorCounts, setColorCounts] = useState([]);
    const [locationCounts, setLocationCounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState("החדש ביותר");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [currentPage, setCurrentPage] = useState(() => {
        const storedState = sessionStorage.getItem('lastListState');
        return storedState ? JSON.parse(storedState).page : 1;
    });
    const [dressesPerPage] = useState(16);
    const [totalPages, setTotalPages] = useState(1);
    const query = useQuery();
    const navigate = useNavigate();

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
                const data = await fetchDresses();
                setAllDresses(data.dresses);
                setColorCounts(data.colorCounts);
                setLocationCounts(data.locationCounts);
                setTotalPages(Math.ceil(data.totalCount / dressesPerPage));
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const params = new URLSearchParams();
        params.append('page', page);
        if (selectedColor) params.append('color', selectedColor);
        if (selectedLocation) params.append('location', selectedLocation);
        navigate(`/dresses?${params.toString()}`);
        window.scrollTo(0, 0); 
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
    };

    const paginatedDresses = useMemo(() => {
        const startIndex = (currentPage - 1) * dressesPerPage;
        const endIndex = startIndex + dressesPerPage;
        return sortedDresses.slice(startIndex, endIndex);
    }, [currentPage, sortedDresses, dressesPerPage]);

    const colors = ["אדום", "אפור", "בורדו", "ורוד", "זהב", "חום", "ירוק", "כחול", "כסף", "כתום", "לבן", "סגול", "צבעוני", "שחור", "שמנת", "תכלת"];
    const locations = [
        "בני-ברק", "אלעד", "אשקלון", "בית-שמש", "ביתר-עילית",
        "גבעת-זאב", "חולון", "חיפה", "חריש", "טבריה",
        "ירושלים", "לוד", "מודיעין-עילית", "נתניה", "פתח-תקווה",
        "קרית-מלאכי", "ראשון-לציון", "רחובות", "רכסים",
        "רמת-השרון", "תל-אביב"
    ];

    return (
        <div className="dress-list-page">
            <div className="hero-section">
                <h1>שמלות ערב להשכרה</h1>
                <p>קולקציות שמלות ערב להשכרה מכל רחבי הארץ</p>
            </div>

            <DressListFilters
                sort={sort}
                selectedColor={selectedColor}
                selectedLocation={selectedLocation}
                colors={colors}
                colorCounts={colorCounts}
                locations={locations}
                locationCounts={locationCounts}
                onSortSelect={handleSortSelect}
                onColorSelect={handleColorSelect}
                onLocationSelect={handleLocationSelect}
            />

            <DressListGrid loading={loading} dresses={paginatedDresses} />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default DressListPage;