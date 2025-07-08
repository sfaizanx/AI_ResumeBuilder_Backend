const Router = require('express').Router();
const { requestEmailVerification, verifyEmail } = require('../Controllers/emailController');

// Router.post('/authemail', RegisteredEmail, (req,res)=> {
//   res.status(200).json({ success: true, message: "Email sent successfully" });
// });

Router.post('/verifyemail', requestEmailVerification);

Router.get('/verifytoken/:token', verifyEmail );

module.exports = Router;
