"use client";

import Signup from "@/components/signup/Signup";
import React, { useEffect, useState } from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import dynamic from 'next/dynamic';

const SignupPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
  }, []);

  // Simple client-side rendering check
  if (!isClient) {
    return null; // Or a loading indicator
  }

  return (
    <Theme accentColor="blue" appearance="light">
      <Signup />
    </Theme>
  );
};

export default SignupPage;