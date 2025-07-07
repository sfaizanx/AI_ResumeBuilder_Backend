const { signUp, login } = require('../Controllers/authController');
const { loginValidation, sigupValidation } = require('../MIddleWare/AuthValidate');
const ensureAuth = require('../MIddleWare/JWTAuth');

const router = require('express').Router();

router.post('/login', loginValidation ,login);

router.post('/Signup',sigupValidation, signUp);

router.get('/Validtoken', ensureAuth, (req, res) => {
  res.status(200).json({ success: true, message: "Token is valid" });
});


module.exports = router;