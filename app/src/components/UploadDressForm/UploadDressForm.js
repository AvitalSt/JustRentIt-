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
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length === 0) {
      setImage(null);
      setError("❌ חובה להעלות תמונה!");
    } else {
      setImage(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("❌ חובה להעלות תמונה!");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    formDataToSend.append("image", image);

    try {
      await addDressEmail(formDataToSend);
      setSuccessMessage(
        "פרטי השמלה שלך נשלחו. בבקשה חכו לאישור העלאת השמלה במייל. תזכורת: אם תהיה השכרה דרך האתר, נבקש 15% ממחיר השמלה. תודה על שיתוף הפעולה."
      );
      setModalIsOpen(true);
    } catch (error) {
      alert("❌ שגיאה בהוספת השמלה");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSuccessMessage("");
    navigate("/");
  };

  return (
    <div className="add-dress-container">
      <h2>✨ הוספת שמלה</h2>
      <form
        className="add-dress-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="fullName"
          placeholder=" שם מלא"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder=" טלפון"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder=" אימייל"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="dressName"
          placeholder=" שם השמלה"
          value={formData.dressName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder=" מיקום"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="buyPrice"
          placeholder=" מחיר קנייה"
          value={formData.buyPrice}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rentPrice"
          placeholder=" מחיר השכרה"
          value={formData.rentPrice}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="size"
          placeholder=" מידה"
          value={formData.size}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="add-dress-btn" type="submit">
          ➕ הוסף שמלה
        </button>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="הודעת הצלחה"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
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