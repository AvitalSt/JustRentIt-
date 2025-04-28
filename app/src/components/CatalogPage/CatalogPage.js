import React, { useState } from 'react';
import { sendCatalogEmail } from '../../services/emailService';
import './CatalogPage.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function CatalogPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        const nameTrimmed = name.trim();
        if (!nameTrimmed) {
            newErrors.name = "שם מלא הוא שדה חובה";
            isValid = false;
        } else if (nameTrimmed.length < 2) {
            newErrors.name = "שם אינו תקין";
            isValid = false;
        }

        const emailTrimmed = email.trim();
        if (!emailTrimmed) {
            newErrors.email = "כתובת מייל היא שדה חובה";
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
            if (!emailRegex.test(emailTrimmed)) {
                newErrors.email = "כתובת המייל אינה תקינה";
                isValid = false;
            }
        }

        setError(Object.values(newErrors).join('\n') || null);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                await sendCatalogEmail({ fullName: name, email: email });
                setModalIsOpen(true);
            } catch (err) {
                setError(err.message);
                console.error(err);
            }
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="catalog-container">
            <h1>קבלו את קטלוג השמלות המלא שלנו</h1>
            <p>מלאו את הטופס וקבלו למייל את קטלוג השמלות המלא שלנו.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="שם מלא"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                {error && error.includes("שם מלא") && <p className="error-message">{error.split('\n').find(err => err.includes("שם מלא"))}</p>}
                <input
                    type="email"
                    placeholder="כתובת מייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {error && error.includes("מייל") && <p className="error-message">{error.split('\n').find(err => err.includes("מייל"))}</p>}
                <button type="submit">שלח לי את הקטלוג</button>
            </form>
            {error && !error.includes("שם מלא") && !error.includes("מייל") && <p className="error-message">{error}</p>}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="הודעה"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <p>בדקות הקרובות תקבלו מייל עם קטלוג השמלות שלנו.</p>
                <button onClick={closeModal}>סגור</button>
            </Modal>
        </div>
    );
}

export default CatalogPage;