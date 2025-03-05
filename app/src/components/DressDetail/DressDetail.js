import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDressDetails } from "../../services/dressService";
import { interestDressEmail } from "../../services/emailService";
import Modal from "react-modal";

Modal.setAppElement("#root");

function DressDetail() {
    const { id } = useParams();
    const [dress, setDress] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
    });
    const [imageError, setImageError] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchDress = async () => {
            try {
                const data = await getDressDetails(id);
                setDress(data);
            } catch (error) {
                console.error("Error fetching dress:", error);
            }
        };
        fetchDress();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formPayload = {
            ...formData,
            dressName: dress.name,
            dressId: dress._id,
        };

        try {
            await interestDressEmail(formPayload);
            setSuccessMessage("הפרטים נשלחו בהצלחה!");
            setModalIsOpen(true);
            setFormData({ fullName: "", email: "", phone: "" });
        } catch (error) {
            console.error("Error sending email:", error);
            alert("הייתה בעיה בשמירה או שליחה של הפרטים. נסה שוב.");
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSuccessMessage("");
    };

    if (!dress) {
        return null;
    }

    const API_URL = process.env.REACT_APP_API_URL;

    return (
        <div className="dress-detail container my-5">
            <div className="row">
                <div className="col-md-6">
                    {imageError ? (
                        <img src="/placeholder.png" alt="Placeholder" className="img-fluid rounded shadow-lg" />
                    ) : (
                        <img
                            src={`${API_URL}/uploads/${dress.image}`}
                            alt={dress.name}
                            className="img-fluid rounded shadow-lg"
                            onError={handleImageError}
                        />
                    )}
                </div>
                <div className="col-md-6">
                    <h2 className="mb-3 text-center">{dress.name}</h2>
                    <p className="lead">מיקום: {dress.location}</p>
                    <p className="lead">מידה: {dress.size}</p>
                    <p className="h5 text-danger">מחיר קנייה: ₪{dress.buyPrice}</p>
                    <p className="h5 text-success">מחיר השכרה: ₪{dress.rentPrice}</p>

                    <h4 className="mt-4 text-center">לפרטים נוספים, מלא את הטופס למטה:</h4>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="שם מלא"
                                className="form-control"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="email"
                                placeholder="מייל"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="tel"
                                placeholder="מספר טלפון"
                                className="form-control"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100">שלח פרטים</button>
                    </form>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="הודעת הצלחה"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <p>{successMessage}</p>
                <button onClick={closeModal}>סגור</button>
            </Modal>
        </div>
    );
}

export default DressDetail;