const router = require('express').Router();
const { atsScore } = require('../Controllers/atsResume');
const multer = require("multer");
const ensureAuth = require('../MIddleWare/JWTAuth');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/pdftotext', ensureAuth, upload.single("file"), atsScore);

module.exports = router;

