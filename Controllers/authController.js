const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/Users");
const { RegisteredEmail } = require("./emailController");

const login = async (req, res) => {
  try {
    const { email, password, googleAuth } = req.body;

    if (googleAuth) {
      const decoded = jwt.decode(googleAuth);
      if (!decoded || !decoded.email) {
        return res
          .status(400)
          .json({ message: "Invalid Google Credentials", success: false });
      }

      let user = await UserModel.findOne({ email: decoded.email });

      if (!user) {
        // Auto-create new user if not exists (optional)
        user = new UserModel({
          email: decoded.email,
          password: "", // No password for Google login
        });
        await user.save();
        
        try {
          await RegisteredEmail(user.email);
        } catch (err) {
          console.log("Error sending email:", err);
        }
      }

      const jwtToken = jwt.sign(
        { email: user.email, _id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );
      return res
        .status(200)
        .json({
          message: "Login successful",
          success: true,
          jwtToken,
          email: user.email,
          name: decoded.name,
        });
    }

    const user = await UserModel.findOne({ email });
    const errMssge = "Auth failed email or password is incorrect";
    if (!user) {
      return res.status(404).json({ message: errMssge, success: false });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(404).json({ message: errMssge, success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    res
      .status(200)
      .json({ message: "login Successfully", success: true, jwtToken, email });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.send("User not found.");
    }
    if (!user.isVerified) {
      return res.send("Email not verified yet.");
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();
    await RegisteredEmail(email);

    res
      .status(200)
      .json({
        message: "Password set! You are now fully registered.",
        success: true,
      });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = { signUp, login };
