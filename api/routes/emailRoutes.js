const express = require('express');
const multer = require('multer');
const path = require('path');
const { sendInterestEmail, sendAddDressEmail } = require('../controllers/emailController');

const router = express.Router();

const upload = multer({ storage: multer.diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }) });

router.post('/interest-dress-Email', sendInterestEmail);
router.post('/add-dress-Email', upload.single('image'), sendAddDressEmail);

module.exports = router;