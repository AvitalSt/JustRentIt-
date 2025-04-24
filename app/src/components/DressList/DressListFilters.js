import React, { useState, useRef, useEffect } from "react";
import './DressList.css'; 

function SortDropdown({ sort, onSortSelect }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSortSelect = (selectedSort) => {
        onSortSelect(selectedSort);
        setIsDropdownOpen(false);
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
        <div className="sort-container" ref={dropdownRef}>
            <button className="sort-button" onClick={handleDropdownToggle}>
                מיין לפי {sort}
            </button>
            <div className={`sort-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                <button onClick={() => handleSortSelect('החדש ביותר')}>החדש ביותר</button>
                <button onClick={() => handleSortSelect('מחיר: נמוך לגבוה')}>מחיר: נמוך לגבוה</button>
                <button onClick={() => handleSortSelect('מחיר: גבוה לנמוך')}>מחיר: גבוה לנמוך</button>
            </div>
        </div>
    );
}

function ColorDropdown({ selectedColor, colors, colorCounts, onColorSelect }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleColorSelect = (color) => {
        onColorSelect(color);
        setIsDropdownOpen(false);
    };

    const getCount = (array, id) => {
        const count = array.find((item) => item._id === id);
        return count ? `(${count.count})` : "(0)";
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
        <div className="sort-container" ref={dropdownRef}>
            <button className="sort-button" onClick={handleDropdownToggle}>
                {selectedColor ? selectedColor : "בחר צבע"}
            </button>
            <div className={`sort-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                <button onClick={() => handleColorSelect('')}>כל הצבעים</button>
                {colors.map(color => (
                    <button key={color} onClick={() => handleColorSelect(color)}>
                        {color} {getCount(colorCounts, color)}
                    </button>
                ))}
            </div>
        </div>
    );
}

function LocationDropdown({ selectedLocation, locations, locationCounts, onLocationSelect }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLocationSelect = (location) => {
        onLocationSelect(location);
        setIsDropdownOpen(false);
    };

    const getCount = (array, id) => {
        const count = array.find((item) => item._id === id);
        return count ? `(${count.count})` : "(0)";
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
        <div className="sort-container" ref={dropdownRef}>
            <button className="sort-button" onClick={handleDropdownToggle}>
                {selectedLocation ? selectedLocation : "בחר עיר"}
            </button>
            <div className={`sort-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                <button onClick={() => handleLocationSelect('')}>כל הערים</button>
                {locations.map(location => (
                    <button key={location} onClick={() => handleLocationSelect(location)}>
                        {location} {getCount(locationCounts, location)}
                    </button>
                ))}
            </div>
        </div>
    );
}

function DressListFilters({
    sort,
    selectedColor,
    selectedLocation,
    colors,
    colorCounts,
    locations,
    locationCounts,
    onSortSelect,
    onColorSelect,
    onLocationSelect
}) {
    return (
        <div className="filter-container">
            <SortDropdown sort={sort} onSortSelect={onSortSelect} />
            <ColorDropdown
                selectedColor={selectedColor}
                colors={colors}
                colorCounts={colorCounts}
                onColorSelect={onColorSelect}
            />
            <LocationDropdown
                selectedLocation={selectedLocation}
                locations={locations}
                locationCounts={locationCounts}
                onLocationSelect={onLocationSelect}
            />
        </div>
    );
}

export default DressListFilters;