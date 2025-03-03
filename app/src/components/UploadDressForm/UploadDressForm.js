import React, { useState } from "react";
import { addDressEmail } from "../../services/emailService";
import './UploadDressForm.css'; 

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
      alert("🎉 השמלה נוספה בהצלחה!");
    } catch (error) {
      alert("❌ שגיאה בהוספת השמלה");
    }
  };

  return (
    <div className="add-dress-container">
      <h2>✨ הוספת שמלה</h2>
      <form className="add-dress-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="fullName" placeholder="👤 שם מלא" value={formData.fullName} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="📞 טלפון" value={formData.phone} onChange={handleChange} required />
        <input type="email" name="email" placeholder="📧 אימייל" value={formData.email} onChange={handleChange} required />
        <input type="text" name="dressName" placeholder="👗 שם השמלה" value={formData.dressName} onChange={handleChange} required />
        <input type="text" name="location" placeholder="📍 מיקום" value={formData.location} onChange={handleChange} required />
        <input type="number" name="buyPrice" placeholder="💰 מחיר קנייה" value={formData.buyPrice} onChange={handleChange} required />
        <input type="number" name="rentPrice" placeholder="💸 מחיר השכרה" value={formData.rentPrice} onChange={handleChange} required />
        <input type="text" name="size" placeholder="📏 מידה" value={formData.size} onChange={handleChange} required />

        <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="add-dress-btn" type="submit">➕ הוסף שמלה</button>
      </form>
    </div>
  );
}

export default AddDressForm;
