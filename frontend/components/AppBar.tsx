"use client";
import React, { useEffect, useState } from "react";
import LinkButton from "./buttons/LinkButton";
import PrimaryButton from "./buttons/PrimaryButton";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";


const AppBar = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
        setIsAuthenticated(false);
        return;
    }

    // Optimistically set to true to avoid flicker, but verify
    // Or better, wait for verification (might show login briefly)
    // Let's verify.
    axios.get(`${BACKEND_URL}/api/v1/user`, {
        headers: {
            Authorization: token
        }
    })
    .then(() => {
        setIsAuthenticated(true);
    })
    .catch(() => {
        // Token invalid
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/");
  };


  return (
    <nav className="flex border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 justify-between items-center px-6 py-3 shadow-sm">
      <div 
        className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent cursor-pointer"
        onClick={() => router.push("/")}
      >
        Zapier
      </div>
      <div className="flex items-center gap-4">
        <LinkButton onClick={() => {}}>Contact Sales</LinkButton>
        
        {isAuthenticated ? (
          <>
            <LinkButton onClick={() => router.push("/dashboard")}>Dashboard</LinkButton>
            <PrimaryButton size="sm" onClick={handleLogout}>
              Log out
            </PrimaryButton>
          </>
        ) : (
          <>
            <LinkButton onClick={() => router.push("/login")}>Log in</LinkButton>
            <PrimaryButton size="sm" onClick={() => router.push("/signup")}>
              Sign Up
            </PrimaryButton>
          </>
        )}
      </div>
    </nav>
  );
};



export default AppBar;
