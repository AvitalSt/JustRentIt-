import React, { useState } from 'react';

function VisualSearch() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleSearch = async () => {
        if (!selectedImage) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await fetch('/search', { // נקודת קצה בשרת
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleSearch} disabled={!selectedImage || loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>

            {loading && <p>Loading...</p>}

            <div>
                {searchResults.map((dress) => (
                    <div key={dress._id}>
                        <img src={`/uploads/${dress.image}`} alt={dress.name} style={{ maxWidth: '100px' }} />
                        <p>{dress.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VisualSearch;