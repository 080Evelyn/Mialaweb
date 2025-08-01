import React, { useState } from "react";
import AuthBg from "../assets/images/dashboard.jpg";
import logo from "../assets/images/main-logo.svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {};
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
                <span className="text-2xl font-medium">Sign Up</span>
                <span className="text-sm">
                  Enter your details or already have an account{" "}
                  <span className="text-[#B10303]">
                    <Link to="/login">Sign In</Link>
                  </span>
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

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
              </div>

              <Button
                type="submit"
                className="w-full bg-[#B10303] hover:bg-[#B10303]/80">
                Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
