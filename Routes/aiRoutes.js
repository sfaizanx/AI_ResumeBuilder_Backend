const { aiJobDesc, getTitle, getResume } = require('../Controllers/aiBuilder');

const router = require('express').Router();

router.post('/Aidesc', aiJobDesc);
router.post('/suggest-title', getTitle);
router.post('/AIResume', getResume);

module.exports = router;