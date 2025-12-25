import React from "react";

interface OtpDisplayProps {
  username: string;
  otp: string;
  className?: string;
}

/**
 * VerificationEmail
 *
 * Shows a friendly message with the OTP for the user.
 */
const VerificationEmail: React.FC<OtpDisplayProps> = ({ username, otp, className = "" }) => {
  return (
    <div
      className={`max-w-md w-full mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8 text-center ${className}`}
    >
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Hello, {username}!
      </h1>

      <p className="text-gray-600 mb-4">
        Your verification code (OTP) is:
      </p>

      <p className="text-blue-600 font-bold text-3xl mb-6 tracking-widest">
        {otp}
      </p>

      <p className="text-gray-700 mb-4">
        Enter this OTP in the application to verify your account.
        <a href="#">Verify Account</a>
      </p>

      <p className="text-gray-500 text-sm">
        For security reasons, do not share this code with anyone.
      </p>

    </div>
  );
};

export default VerificationEmail;
