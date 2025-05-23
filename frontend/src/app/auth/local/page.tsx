"use client";

import Login from "@/components/login/Login";
import React from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

const LocalAuth = () => {
  return (
    <Theme accentColor="blue" appearance="light">
      <Login mode="local" />
    </Theme>
  );
};

export default LocalAuth;