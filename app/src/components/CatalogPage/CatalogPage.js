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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await sendCatalogEmail({ fullName: name, email: email });
            setModalIsOpen(true);
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="catalog-container">
            <h1>קבלו את קטלוג השמלות המלא שלנו</h1>
            <p>מלאי את הטופס וקבלי למייל את קטלוג השמלות המלא שלנו.</p>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="כתובת מייל" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">שלח לי את הקטלוג</button>
            </form>
            {error && <p className="error-message">{error}</p>}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="הודעה"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <p>בדקות הקרובות תקבל מייל עם קטלוג השמלות שלנו.</p>
                <button onClick={closeModal}>סגור</button>
            </Modal>
        </div>
    );
}

export default CatalogPage;