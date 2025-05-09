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

        const fullNameTrimmed = formData.fullName.trim();
        const words = fullNameTrimmed.split(' ');
        
        if (fullNameTrimmed.length < 2 || words.length < 2) {
            newErrors.fullName = "אנא הכנסי שם פרטי ושם משפחה";
            isValid = false;
        } else if (words.some(word => word.length < 2)) {
            newErrors.fullName = "אנא הכנסי שם פרטי ושם משפחה";
            isValid = false;
        }
        

        const phoneTrimmed = formData.phone.trim();
        const phoneRegex = /^\d{9,10}$/;
        if (!phoneRegex.test(phoneTrimmed)) {
            newErrors.phone = "מספר טלפון לא תקין";
            isValid = false;
        }

        const emailTrimmed = formData.email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailTrimmed && !emailRegex.test(emailTrimmed)) {
            newErrors.email = "כתובת האימייל אינה תקינה";
            isValid = false;
        } else if (!emailTrimmed) {
            newErrors.email = "אימייל נדרש";
            isValid = false;
        }

        const dressNameTrimmed = formData.dressName.trim();
        if (dressNameTrimmed.length < 3) {
            newErrors.dressName = "שם השמלה אינו תקין";
            isValid = false;
        }

        const locationTrimmed = formData.location.trim();
        if (locationTrimmed.length < 2) {
            newErrors.location = "מיקום אינו תקין";
            isValid = false;
        }

        const buyPriceTrimmed = formData.buyPrice.trim();
        if (buyPriceTrimmed && isNaN(Number(buyPriceTrimmed))) {
            newErrors.buyPrice = "מחיר אינו תקין";
            isValid = false;
        } else if (!buyPriceTrimmed) {
            newErrors.buyPrice = "מחיר קנייה נדרש.";
            isValid = false;
        }

        const rentPriceTrimmed = formData.rentPrice.trim();
        if (rentPriceTrimmed && isNaN(Number(rentPriceTrimmed))) {
            newErrors.rentPrice = "מחיר אינו תקין";
            isValid = false;
        } else if (!rentPriceTrimmed) {
            newErrors.rentPrice = "מחיר השכרה נדרש.";
            isValid = false;
        }

        const sizeTrimmed = formData.size.trim();
        if (sizeTrimmed.length < 1) {
            newErrors.size = "יש להכניס מידה לשמלה.";
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
            <h2>הוספת שמלה</h2>
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