require('dotenv').config();
const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

exports.sendInterestEmail = async (req, res) => {
  try {
    const { fullName, email, phone, dressId } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      subject: `💃 התעניינות בשמלה מס' ${dressId}`,
      text: `👗 שם מלא: ${fullName}\n📧 אימייל: ${email}\n📞 טלפון: ${phone}\n#️⃣ מספר שמלה: ${dressId}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: '📩 ההתעניינות נשלחה בהצלחה!' });
  } catch (error) {
    console.error('❌ שגיאה בשליחת המייל:', error);
    res.status(500).json({ success: false, message: '⚠️ שגיאה בשליחת המייל' });
  }
};

exports.sendAddDressEmail = async (req, res) => {
  try {
    console.log(req.body); 

    const {fullName, dressName, location, buyPrice, rentPrice, size, phone, email } = req.body;
    
    const imagePath = req.file ? path.join(__dirname, '..', 'uploads', req.file.filename) : null;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      subject: `✨ הוספת שמלה חדשה - ${dressName}`,
      text: `👗 שם השמלה: ${dressName}\n📍 מיקום: ${location}\n💰 מחיר קנייה: ${buyPrice}\n💸 מחיר השכרה: ${rentPrice}\n📏 מידה: ${size}\n\n👤 שם מלא: ${fullName}\n📞 טלפון: ${phone}\n📧 אימייל: ${email}`,
      attachments: imagePath
        ? [
            {
              filename: req.file.filename, 
              path: imagePath, 
              cid: 'dressImage', 
            },
          ]
        : [], 
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: '👗 הפרטים נשלחו בהצלחה!' });
  } catch (error) {
    console.error('❌ שגיאה בשליחת המייל:', error);
    res.status(500).json({ success: false, message: '⚠️ שגיאה בשליחת המייל' });
  }
};
