"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, MailOpen, LockIcon, AlertCircle } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors({ ...errors, name: "" });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: "" });
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    if (errors.phoneNumber) {
      setErrors({ ...errors, phoneNumber: "" });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "" });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Reset errors
    const newErrors = {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: ""
    };
    let hasError = false;

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      hasError = true;
    }

    // Validate phone number
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      hasError = true;
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
      hasError = true;
    }

    // Validate password
    if (!password.trim()) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    // If there are errors, update state and return
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Proceed with registration
    setIsSubmitting(true);
    try {
      // Here you would typically call your registration API
      console.log("Registering with:", { name, email, phoneNumber, password });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // If successful, you might redirect or update state
      alert("Registration successful!");
      router.push("/auth");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        ...newErrors,
        email: "Registration failed. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full p-20">
      {/* Left Div */}
      <div className="flex flex-col justify-center w-1/2 bg-white p-20">
        <div className="flex flex-col items-center justify-center ">
          <p className="text-purple-900 text-3xl font-bold text-center">Boutique Laundry Service</p>
          <p className="text-[#565657] text-base font-bold text-center">They specialize in selling fashionable clothing, accessories, and sometimes unique gifts or home goods.</p>        
        </div>
        <div className="flex flex-col">
          <p className="text-[#565657] text-base font-bold text-center p-8">Already have an account?</p>
          <div className="flex justify-center text-white">
            <Link href="/auth" className="hover:text-blue-500 transition duration-300 ease-in-out">
              <Button variant="outline" size="custom" className="text-black">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right Div */}
      <div className="flex flex-col justify-center w-1/2 p-4 pb-10 gap-4 sm:p-40 rounded shadow-lg bg-[#F8F9FE]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <FloatingLabelInput 
              label="Name" 
              type="text" 
              placeholder="" 
              value={name}
              onChange={handleNameChange}
            />
            {errors.name && (
              <div className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.name}
              </div>
            )}
          </div>
          
          <div>
            <FloatingLabelInput 
              label="Email" 
              type="email" 
              placeholder="" 
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.email}
              </div>
            )}
          </div>
          
          <div>
            <FloatingLabelInput 
              label="Phone Number" 
              type="tel" 
              placeholder="" 
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
            {errors.phoneNumber && (
              <div className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.phoneNumber}
              </div>
            )}
          </div>
          
          <div>
            <FloatingLabelInput 
              label="Password" 
              type="password" 
              placeholder="" 
              value={password}
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <div className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.password}
              </div>
            )}
          </div>
          
          <div>
            <FloatingLabelInput 
              label="Confirm Password" 
              type="password" 
              placeholder="" 
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {errors.confirmPassword && (
              <div className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.confirmPassword}
              </div>
            )}
          </div>
          
          <div className="flex justify-center text-white mt-4">
            <Button 
              type="submit"
              variant="outline" 
              size="custom" 
              className="text-customText bg-[#5861AE]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
