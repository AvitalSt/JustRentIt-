import React, { useState } from "react";
import { addDressEmail } from "../../services/emailService";
import Modal from "react-modal";
import "./UploadDressForm.css";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

function AddDressForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        dressName: "",
        location: "",
        buyPrice: "",
        rentPrice: "",
        size: "",
    });

    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        const requiredFields = ["fullName", "email", "phone", "dressName", "location", "buyPrice", "rentPrice", "size"];
        requiredFields.forEach((field) => {
            if (!formData[field].trim()) {
                newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} נדרש`;
                isValid = false;
            }
        });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "מייל לא תקין";
            isValid = false;
        }

        const phoneRegex = /^\d{9,10}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = "מספר טלפון לא תקין";
            isValid = false;
        }

        if (!image) {
            newErrors.image = "❌ חובה להעלות תמונה!";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        formDataToSend.append("image", image);

        try {
            await addDressEmail(formDataToSend);
            setModalIsOpen(true);
        } catch (error) {
            alert("❌ שגיאה בהוספת השמלה");
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        navigate("/");
    };

    return (
        <div className="add-dress-container">
            <h2>✨ הוספת שמלה</h2>
            <form className="add-dress-form" onSubmit={handleSubmit} encType="multipart/form-data">
                {Object.keys(formData).map((key) => (
                    <div key={key} className="input-group">
                        <input
                            type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                            name={key}
                            placeholder={
                                key === "fullName" ? "שם מלא" :
                                key === "phone" ? "טלפון" :
                                key === "email" ? "אימייל" :
                                key === "dressName" ? "שם השמלה" :
                                key === "location" ? "מיקום" :
                                key === "buyPrice" ? "מחיר קנייה" :
                                key === "rentPrice" ? "מחיר השכרה" :
                                key === "size" ? "מידה" :
                                ""
                            }
                            value={formData[key]}
                            onChange={handleChange}
                        />
                        {errors[key] && <div className="text-danger">{errors[key]}</div>}
                    </div>
                ))}

                <input type="file" name="image" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                {errors.image && <div className="text-danger">{errors.image}</div>}

                <button className="add-dress-btn" type="submit" disabled={isLoading}>
                    {isLoading ? "השמלה נשלחת, אנא המתן..." : "➕ הוסף שמלה"}
                </button>
            </form>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="הודעת הצלחה" className="modal-content" overlayClassName="modal-overlay">
                <h2>שמלתך נשלחה בהצלחה!</h2>
                <p>
                    פרטי השמלה נשלחו לבדיקה ואישור.
                    <br />
                    נעדכן אותך במייל ברגע שהיא תאושר להעלאה.
                    <br />
                    זכרי, במידה ותתבצע השכרה דרך האתר,
                    <br />
                    תחול עמלה של 15% ממחיר ההשכרה.
                    <br />
                    אנו מעריכים את שיתוף הפעולה!
                    <br />
                </p>
                <button className="general-button" onClick={closeModal}>סגור</button>
            </Modal>
        </div>
    );
}

export default AddDressForm;