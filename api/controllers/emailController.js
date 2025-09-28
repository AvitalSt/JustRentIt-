const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

const sendInterestEmail = async (req, res) => {
  try {
    const { fullName, email, phone, dressId } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `💃 התעניינות בשמלה מס' ${dressId}`,
      text: `👗 שם מלא: ${fullName}\n📧 אימייל: ${email}\n📞 טלפון: ${phone}\n#️⃣ מספר שמלה: ${dressId}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'ההתעניינות נשלחה בהצלחה!' });
  } catch (error) {
    console.error("שגיאת SMTP אמיתית בשרת:", error); 
    res.status(500).json({ success: false, message: ' שגיאה בשליחת המייל' });
  }
};

const sendAddDressEmail = async (req, res) => {
  try {
    const { fullName, dressName, location, buyPrice, rentPrice, size, phone, email } = req.body;

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
    setImmediate(async () => {
      await sendConfirmationEmail(email, fullName);
    });
    res.status(200).json({ success: true, message: '👗 הפרטים נשלחו בהצלחה!' });
  } catch (error) {
    res.status(500).json({ success: false, message: '⚠️ שגיאה בשליחת המייל' });
  }
};

const sendConfirmationEmail = async (email, fullName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'היי, תודה על העלאת השמלה! ',
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif;">
          <p>היי ${fullName},</p>
          <p>תודה שהעלית את השמלה שלך ל-JustRentIt! ✨</p>
          <p>לפני שנוכל לפרסם אותה באתר, חשוב שתאשרי את תנאי השימוש באתר שלנו.</p>

          <p><b> 📌 כמה דברים חשובים:</b></p>
          <p>✔ במקרה של השכרה דרך האתר, תחול <b>עמלה של 15%</b> ממחיר השכרת השמלה.</p>
          <p>✔ התשלום יתבצע בהעברה בנקאית – (תקבלי את פרטי העברה במקרה של השכרת שמלה).</p>

          <p><b>⚠️ הגינות לפני הכול!</b></p>
          <p>אם מישהי שכרה ממך את השמלה דרכנו ולא שילמת את העמלה – זה <b>גזל גמור</b>.</p>

          <p><b>❗חשוב לדעת:</b></p>
          <p>אם מישהי התעניינה בשמלה שלך דרך האתר, אנו נשלח את פרטי הקשר שלך למתעניינת ונחבר ביניכם.</p>
          <p><b>האחריות היא שלך!</b> עלייך לוודא שתשלמי את העמלה במקרה של השכרה דרך האתר.</p>

          <p><b> 📄 תנאי השימוש:</b></p>
          <p>כשתאשרי את התנאים, השמלה שלך תעלה לאתר, ואני אשלח לך עדכון כשהיא תפורסם!</p>
          <p>לסיום, פשוט <b>הגיבי לי במלל "מאשרת"</b>, ואפרסם את השמלה שלך!</p>

          <p>שאלות? אני כאן לכל דבר 💌 </p>
          <p><a href="mailto:just.rent.it1@gmail.com">just.rent.it1@gmail.com</a></p>

          <p>לא יכולים לחכות לראות את השמלה שלך באתר! ✨</p>

          <p><b>צוות JustRentIt</b></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('⚠️ הייתה שגיאה בשליחת המייל');
  }
};

const sendCatalogEmail = async (req, res) => {
  try {
      const { fullName, email } = req.body;

      res.status(200).json({ success: true, message: 'הקטלוג נשלח בהצלחה!' }); 

      setImmediate(async () => {
          const catalogPath = path.join(__dirname, '..', '..', 'app', 'public', 'קטלוג.pdf');

          const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: 'קטלוג השמלות של JustRentIt',
              text: `היי ${fullName},\n\nמצורף קטלוג השמלות שלנו.`,
              attachments: [
                  {
                      filename: 'קטלוג.pdf',
                      path: catalogPath,
                      contentType: 'application/pdf',
                  },
              ],
          };

          try {
              await transporter.sendMail(mailOptions);
              console.log('קטלוג השמלות נשלח בהצלחה למייל:', email);
          } catch (error) {
              console.error('שגיאה בשליחת המייל:', error);
          }
      });
  } catch (error) {
      res.status(500).json({ success: false, message: 'שגיאה בשליחת המייל' });
  }
};

module.exports = { sendInterestEmail, sendAddDressEmail, sendConfirmationEmail, sendCatalogEmail };