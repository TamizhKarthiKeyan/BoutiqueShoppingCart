"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FloatingLabelInputProps {
  label: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FloatingLabelInput = ({ 
  label, 
  type, 
  placeholder, 
  value: externalValue, 
  onChange 
}: FloatingLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  
  // Determine if we're using controlled or uncontrolled input
  const isControlled = externalValue !== undefined;
  const value = isControlled ? externalValue : internalValue;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isControlled) {
      // If controlled, call the external onChange
      onChange && onChange(e);
    } else {
      // If uncontrolled, update internal state
      setInternalValue(e.target.value);
    }
  };

  return (
    <div className="relative mb-6">
      <Input
        type={type}
        placeholder={placeholder}
        className="flex-1 p-2 border-none shadow-none w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        value={value}
      />
      <Label
        htmlFor={label}
        className={`absolute left-0 transition-all duration-200 ${
          isFocused || value ? "-top-6 text-xs text-[#4552C1]" : "top-1 text-base text-gray-500"
        }`}
      >
        {label}
      </Label>
    </div>
  );
};



export default FloatingLabelInput;
