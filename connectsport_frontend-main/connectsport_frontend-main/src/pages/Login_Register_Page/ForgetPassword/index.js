import React, { useState } from "react";
import IdentityVerificationComponent from "./IdentifyUser";
import SecurityQuestionsComponent from "./SecurityQuestion";
import OtpVerificationComponent from "./OtpVerification";
import NewPasswordComponent from "./NewPassword";
import "../../../Styles/Login_Register_Page/forgetPassword.css";
import BackgroundImage from "../../../assets/images/background.jpg";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  // Extended userDetails to include token and answers for seamless data flow between components
  const [userDetails, setUserDetails] = useState({
    email: "",
    token: "",
    questions: [],
    answers: [],
  });

  const handleIdentityVerified = (details) => {
    // Assuming details include { email, token }
    console.log("Identity verified, token received:", details.token);
    setUserDetails((prevDetails) => ({ ...prevDetails, ...details }));
    setStep(2); // Move to security questions
  };

  const handleQuestionsAnswered = (answers) => {
    // Assuming answers is an array or object of answers
    console.log("Questions answered, moving to OTP verification");
    setUserDetails((prevDetails) => ({ ...prevDetails, answers }));
    setStep(3); // This should change the step to 3, causing the page to update
  };

  const handleOtpVerified = () => {
    console.log("OTP Verified, moving to step 4")
    setStep(4); // Move to new password
  };

  const handlePasswordChanged = () => {
    // Password has been successfully changed
    // Here you can redirect to the login page or show a success message
    // For example: navigate('/login');
    console.log("Password changed successfully!");
  };

  return (
    <div
      className="forget__wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="forget__backdrop"></div>
      <div>
        {step === 1 && (
          <IdentityVerificationComponent
            onVerifyIdentity={handleIdentityVerified}
          />
        )}
        {step === 2 && (
          <SecurityQuestionsComponent
            token={userDetails.token}
            onVerifyAnswers={handleQuestionsAnswered}
          />
        )}

        {step === 3 && (
          <OtpVerificationComponent
            token={userDetails.token}
            onVerifyOtp={handleOtpVerified}
          />
        )}
        {step === 4 && (
          <NewPasswordComponent
            token={userDetails.token}
            onChangePassword={handlePasswordChanged}
          />
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
