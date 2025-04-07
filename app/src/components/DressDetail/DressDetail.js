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
    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        phone: "",
    });
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

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "שם מלא נדרש";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "מייל נדרש";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "מייל לא תקין";
            isValid = false;
        }

        const phoneRegex = /^\d{9,10}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = "מספר טלפון נדרש";
            isValid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "מספר טלפון לא תקין";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

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
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSuccessMessage("");
    };

    if (!dress) {
        return null;
    }

    return (
        <div className="dress-detail container my-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={dress.image} className="card-img-top" alt={dress.name} />
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
                            />
                            {errors.fullName && <div className="text-danger">{errors.fullName}</div>}
                        </div>
                        <div className="mb-3">
                            <input
                                type="email"
                                placeholder="מייל"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <input
                                type="tel"
                                placeholder="מספר טלפון"
                                className="form-control"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <div className="text-danger">{errors.phone}</div>}
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