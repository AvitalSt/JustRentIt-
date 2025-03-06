const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAllDresses, getDressById, addDress, deleteDress } = require('../controllers/dressController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
    destination: './uploads/', 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.get('/dresses', getAllDresses);
router.get('/dresses/:id', getDressById);
router.post('/dresses', authenticateToken, upload.single('image'), addDress); 
router.delete('/dresses/:id', deleteDress);

module.exports = router;