const fs = require("fs");
const path = require("path");
const { Resend } = require("resend");
require('dotenv').config();
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, text, html, attachments }) {
  return await resend.emails.send({
    from: `JustRentIt <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments,
  });
}

const sendInterestEmail = async (req, res) => {
  try {
    const { fullName, email, phone, dressId } = req.body;

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `💃 התעניינות בשמלה מס' ${dressId}`,
      text: `👗 שם מלא: ${fullName}\n📧 אימייל: ${email}\n📞 טלפון: ${phone}\n#️⃣ מספר שמלה: ${dressId}`,
    });

    res
      .status(200)
      .json({ success: true, message: "ההתעניינות נשלחה בהצלחה!" });
  } catch (error) {
    console.error("שגיאת שליחת מייל (Interest):", error);
    res.status(500).json({ success: false, message: "⚠️ שגיאה בשליחת המייל" });
  }
};

const sendAddDressEmail = async (req, res) => {
  try {
    const {
      fullName,
      dressName,
      location,
      buyPrice,
      rentPrice,
      size,
      phone,
      email,
    } = req.body;

    const imagePath = req.file
      ? path.join(__dirname, "..", "uploads", req.file.filename)
      : null;

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `✨ הוספת שמלה חדשה - ${dressName}`,
      text: `👗 שם השמלה: ${dressName}\n📍 מיקום: ${location}\n💰 מחיר קנייה: ${buyPrice}\n💸 מחיר השכרה: ${rentPrice}\n📏 מידה: ${size}\n\n👤 שם מלא: ${fullName}\n📞 טלפון: ${phone}\n📧 אימייל: ${email}`,
      attachments: imagePath
        ? [
            {
              filename: req.file.filename,
              path: imagePath,
            },
          ]
        : [],
    });

    setImmediate(async () => {
      await sendConfirmationEmail(email, fullName);
    });

    res.status(200).json({ success: true, message: "👗 הפרטים נשלחו בהצלחה!" });
  } catch (error) {
    console.error("שגיאת שליחת מייל (AddDress):", error);
    res.status(500).json({ success: false, message: "⚠️ שגיאה בשליחת המייל" });
  }
};

const sendConfirmationEmail = async (email, fullName) => {
  try {
    await sendEmail({
      to: email,
      subject: "היי, תודה על העלאת השמלה!",
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif;">
          <p>היי ${fullName},</p>
          <p>תודה שהעלית את השמלה שלך ל-JustRentIt! ✨</p>
          <p>לפני שנוכל לפרסם אותה באתר, חשוב שתאשרי את תנאי השימוש באתר שלנו.</p>
          <p><b> 📌 כמה דברים חשובים:</b></p>
          <p>✔ במקרה של השכרה דרך האתר, תחול <b>עמלה של 15%</b>.</p>
          <p>✔ התשלום יתבצע בהעברה בנקאית.</p>
          <p><b>⚠️ הגינות לפני הכול!</b></p>
          <p>אם לא שולמה העמלה – זה <b>גזל גמור</b>.</p>
          <p><b>❗חשוב לדעת:</b></p>
          <p>האחריות היא שלך לוודא שהתשלום מתבצע.</p>
          <p>כשתאשרי את התנאים, השמלה שלך תעלה לאתר!</p>
          <p><b>צוות JustRentIt</b></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("שגיאת שליחת מייל (Confirmation):", error);
  }
};

async function sendCatalogEmail(req, res) {
  try {
    const { fullName, email } = req.body;

    const catalogPath = path.join(__dirname, "..", "public", "קטלוג.pdf");

    const fileBuffer = fs.readFileSync(catalogPath);

    await sendEmail({
      to: email,
      subject: "קטלוג השמלות של JustRentIt",
      text: `היי ${fullName},\n\nמצורף קטלוג השמלות שלנו.`,
      attachments: [
        {
          filename: "קטלוג.pdf",
          data: fileBuffer,      
          contentType: "application/pdf",
        },
      ],
    });

    res.status(200).json({ success: true, message: "הקטלוג נשלח בהצלחה!" });
  } catch (error) {
    console.error("שגיאה בשליחת הקטלוג:", error);
    res.status(500).json({ success: false, message: "⚠️ שגיאה בשליחת המייל" });
  }
}

module.exports = {
  sendInterestEmail,
  sendAddDressEmail,
  sendConfirmationEmail,
  sendCatalogEmail,
};
