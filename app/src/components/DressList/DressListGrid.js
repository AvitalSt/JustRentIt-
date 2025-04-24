import React from "react";
import DressCard from "./DressCard";
import './DressList.css'; 

function DressListGrid({ loading, dresses }) {
    return (
        <div className="dress-list-container">
            {loading && <p>השמלות בטעינה, אנא המתינו מספר שניות.</p>}
            {!loading && dresses && dresses.length > 0 && (
                dresses.map((dress) => (
                    <DressCard key={dress._id} dress={dress} />
                ))
            )}
            {!loading && (!dresses || dresses.length === 0) && (
                <p>לא נמצאו שמלות התואמות לסינון.</p>
            )}
        </div>
    );
}

export default DressListGrid;