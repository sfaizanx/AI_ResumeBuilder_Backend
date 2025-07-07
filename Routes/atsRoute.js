const router = require('express').Router();
const { atsScore } = require('../Controllers/atsResume');
const multer = require("multer");
const ensureAuth = require('../MIddleWare/JWTAuth');
const upload = multer({ dest: "uploads/" });

router.post('/pdftotext', ensureAuth, upload.single("file"), atsScore);

module.exports = router;

