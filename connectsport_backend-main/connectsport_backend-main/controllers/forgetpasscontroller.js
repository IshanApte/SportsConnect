const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const userModel = require("../model/User");
const crypto = require("crypto");




 exports.verifyuser = async (req, res) => {
    const { email } = req.body;
    console.log("Email received:", email);
    // Find the user with the provided email
    const user = await userModel.findOne({ email: email });
  
    if (!user) {
      return res.status(400).json({ message: "No user found with this email." });
    }
    const token = crypto.randomBytes(20).toString("hex");
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    res.json({ message: "User found", token: token });
  };
  



  exports.securityquestions = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token received:", token);
    const user = await userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    console.log("User found:", user);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
  
    const response = {
      message: "Token verified.",
      questions: {
        question1: user.securityQuestions[0].question,
        question2: user.securityQuestions[1].question,
      },
    };
  
    console.log("Response:", response);
  
    res.json(response);
  };



  
  exports.verifyanswers = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token received:", token);
    const { answers } = req.body;
    const user = await userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    console.log("User found:", user);
    console.log("Answers received:", answers);
  
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
  
    const verifyAnswers = user.securityQuestions.every((userQuestion) => {
      // Find the corresponding question in the provided answers array
      const providedAnswer = answers.find(
        (answer) => answer.question === userQuestion.question
      );
  
      // If corresponding answer is found, compare it with the user's answer
      return providedAnswer && providedAnswer.answer === userQuestion.answer;
    });
  
    if (!verifyAnswers) {
      return res.status(400).json({ message: "Incorrect answers." });
    }
  
    // Generate a one-time password (OTP)
    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({ secret: secret.base32, encoding: "base32" });
  
    // Store the OTP in the user's document for later verification
    user.otp = otp;
    await user.save();
  
    // Send the OTP to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "connectsport17@gmail.com",
        pass: "mikz brrc wcqo onvf",
      },
    });
  
    const mailOptions = {
      from: "connectsport17@gmail.com",
      to: user.email,
      subject: "Your OTP",
      text: `Your OTP is ${otp}`,
    };
  
    // After verifying security questions
    if (verifyAnswers) {
      // Attempt to send the OTP email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Failed to send email:", error);
          // Still respond with success for question verification
          // but indicate that email sending failed
          return res.json({
            success: true,
            emailSent: false,
            message: "Security questions verified, but failed to send OTP email.",
          });
        } else {
          console.log("Email sent:", info.response);
          // Respond with success for both verification and email sending
          return res.json({
            success: true,
            emailSent: true,
            message: "Security questions verified and OTP email sent.",
          });
        }
      });
    } else {
      // Respond with failure if security questions weren't verified
      return res.json({
        success: false,
        message: "Incorrect security answers.",
      });
    }
  };






  exports.verifyotp = async (req, res) => {
    const { token, otp } = req.body;
  
    // Find the user with the provided token
    const user = await userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
  
    if (!user) {
      return res.status(400).json({ message: "No user found with this email." });
    }
  
    // Verify the provided OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }
  
    res.json({ success: true, message: "OTP verified" });
  };




  
  exports.changepassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const user = await userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    // Set the new password
    user.password = newPassword;
    await user.save();
    // Clear the token
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    res.json({ message: "Password changed successfully" });
  };
  


  