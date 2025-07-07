const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const User = require("../Models/Users");
require("dotenv").config();

const requestEmailVerification = async (req, res) => {
  const { email } = req.body;
  const token = uuidv4();

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = await User.findOne({ email });

  if (user) {
    if (user.isVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }
  } else {
    const newUser = new User({
      email,
      isVerified: false,
      verificationToken: token,
    });
    await newUser.save();
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EmailId,
      pass: process.env.EmailPassword,
    },
  });

  const mailOptions = {
    from: "resumebuilder@gmail.com",
    to: email,
    subject: "Sending Email for Verification",
    text:
      "Please verify your email by clicking on the link below:\n" +
      `${process.env.BASE_URL}/${token}`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.status(200)
      .json({ message: "Verification email sent! Check your mail", success: true });
    }
  });
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const user = await User.findOne({ verificationToken: token });
    if (!user) {
        return res.status(400).json({ error: "Invalid token" });
    }
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    res.status(200).json({ message: "Email verified successfully, Go to Signup" });
};

const RegisteredEmail = (email) => {
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sayyedfaizan1777@gmail.com",
      pass: "raao xtmi lnwi wvik",
    },
  });

  const mailOptions = {
    from: "resumebuilder@gmail.com",
    to: email,
    subject: "Registration Successful",
    text: "Welcome to Resume Builder, Your account has been created successfully. You can now log in with your credentials.",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  RegisteredEmail,
  requestEmailVerification,
  verifyEmail
};
