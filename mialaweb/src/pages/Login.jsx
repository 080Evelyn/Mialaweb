import React, { useState } from "react";
import AuthBg from "../assets/images/dashboard.jpg";
import logo from "../assets/images/main-logo.svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "@/lib/Api";
import { useDispatch } from "react-redux";
import { login } from "@/redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [erorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setErrorMessage("");
    try {
      const response = await axios.post(`${BASE_URL}api/v1/auth/login`, {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const { jwt, userRole, userId } = response.data.data;
        dispatch(login({ jwt, userRole, userId }));
        navigate("/overview");
      }
    } catch (error) {
      setErrorMessage(`Error logging in: ${error?.response?.data?.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative h-screen flex  items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-top w-full blur-[3px] z-0"
        style={{ backgroundImage: `url(${AuthBg})` }}
      />

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-lg max-w-[393px] mx-auto">
          <CardHeader>
            <div className="flex flex-col gap-4 justify-center items-center">
              <img src={logo} alt="logo" className="max-w-36" />
              <div className="flex flex-col justify-center items-center">
                <span className="text-2xl font-medium">Login</span>
                {/* <span className="text-sm">
                  Enter your details or don’t have an account?
                  <span className="text-[#B10303]">
                    <Link to="/sign-up">Sign Up</Link>
                  </span>
                </span> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4 ">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {erorMessage && (
                  <p className="text-xs text-red-500">{erorMessage}</p>
                )}
              </div>

              <div className="flex justify-between text-[#B10303] text-[10px]">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="border-1 border-[#B10303] accent-[#B10303] h-3 w-3"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-[10px] font-normal">
                    Remember me
                  </Label>
                </div>

                {/* <span>Forgotten Password?</span> */}
              </div>
              <Button
                onClick={handleLogin}
                type="submit"
                className="w-full bg-[#B10303] hover:bg-[#B10303]/80">
                {isLoading ? "Signing in.." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
