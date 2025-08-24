import React, { useState } from "react";
import AuthBg from "../assets/images/dashboard.jpg";
import logo from "../assets/images/main-logo.svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import OTPModal from "@/components/common/OTPModal";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { BASE_URL } from "@/lib/Api";
import { setStep } from "@/redux/forgotPasswordSlice";
import axios from "axios";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const step = useSelector((state) => state.forgotPassword.step);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (email === "") {
      setErrorMessage("Enter email address.");
      return;
    }
    localStorage.setItem("email", email);
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${BASE_URL}api/v1/auth/forgot-password`,
        { email: email },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseMsg === "Success") {
        dispatch(setStep(1));
      }
    } catch (error) {
      setErrorMessage(error.response.data.responseDesc || `An error occured.`);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyOtp = async (code) => {
    const userEmail = localStorage.getItem("email");
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${BASE_URL}api/v1/auth/verify-otp-for-forget-password`,
        { email: userEmail, otp: code },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseMsg === "Success") {
        dispatch(setStep(2));
      } else if (response.data.responseCode === 55) {
        setErrorMessage(response.data.responseDesc);
      }
    } catch (error) {
      setErrorMessage(`An error occured.`);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    if (success) {
      return;
    }
    e.preventDefault();
    const userEmail = localStorage.getItem("email");
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${BASE_URL}api/v1/auth/reset-password`,
        { email: userEmail, newPassword: password },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseMsg === "Success") {
        setSuccess(true);
        setSuccessMessage("Password reset successful.");
        localStorage.removeItem("email");
      } else if (response.data.responseCode === 55) {
        setErrorMessage(response.data.responseDesc);
      }
    } catch (error) {
      setErrorMessage(`An error occured. `);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-top w-full blur-[3px] z-0"
        style={{ backgroundImage: `url(${AuthBg})` }}
      />

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-lg max-w-[393px] mx-auto">
          <CardHeader>
            <div className="flex flex-col gap-4 justify-center items-center">
              <img src={logo} alt="logo" className="max-w-36" />
              <div className="flex flex-col justify-center items-center text-center">
                <span className="text-2xl font-medium">Forgot Password?</span>
                <span className="text-sm">
                  {/* Enter your details or already have an account{" "} */}
                  <span className="text-[#B10303]">
                    <Link to="/">Sign In</Link>
                  </span>
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {step === 0 && (
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-1.5 relative">
                  <Label htmlFor="password" className="text-sm">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {showPassword && (
                    <Eye
                      onClick={() => {
                        setShowPassword(false);
                      }}
                      className={`absolute  right-0 top-8`}
                    />
                  )}
                  {!showPassword && (
                    <EyeOff
                      onClick={() => {
                        setShowPassword(true);
                      }}
                      className="absolute right-0 top-8"
                    />
                  )}
                </div>
              )}
              {errorMessage && (
                <p className="text-red-500 text-xs">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-xs">{successMessage}</p>
              )}
              {!success && (
                <Button
                  onClick={
                    step === 0
                      ? handleSendOtp
                      : step === 1
                      ? handleVerifyOtp
                      : handleSubmit
                  }
                  type="submit"
                  disable={success}
                  className="w-full bg-[#B10303] hover:bg-[#B10303]/80">
                  {isLoading ? "submitting..." : "Submit"}
                </Button>
              )}

              {success && (
                <Link to={"/"}>
                  <Button className="w-full bg-[#B10303] hover:bg-[#B10303]/80">
                    Login
                  </Button>
                </Link>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
      <OTPModal
        isOpen={step === 1}
        loading={isLoading}
        errorMsg={errorMessage}
        onClose={() => dispatch(setStep(0))}
        length={6}
        onVerify={(code) => {
          handleVerifyOtp(code);
        }}
      />
    </div>
  );
};

export default ForgotPassword;
