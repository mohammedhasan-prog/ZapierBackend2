"use client";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { CheckFeature } from "@/components/CheckFeture";
import AppBar from "@/components/AppBar";
import Input from "@/components/Input";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../config";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
     setLoading(true);
     setError("");
     try {
       await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
         name,
         email,
         password,
       });
       router.push("/login");
     } catch (e: any) {
       console.error("Signup Error:", e);
       setError(e.response?.data?.error || "Signup failed. Please try again.");
     } finally {
       setLoading(false);
     }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppBar />
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
           {/* Left Side - Marketing */}
          <div className="hidden md:flex flex-1 bg-amber-50 p-10 flex-col justify-center">
             <h2 className="text-3xl font-bold text-amber-900 mb-6 leading-tight">
              Join millions of people who are automating their work
            </h2>
            <div className="space-y-4">
              <CheckFeature title={"Easy Setup, no Coding required"} />
              <CheckFeature title={"Free forever for core features"} />
              <CheckFeature title={"14 day free trial"} />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 p-10 flex flex-col justify-center">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900">Get Started</h1>
              <p className="text-gray-500 mt-2">Create your account in seconds.</p>
            </div>

            <div className="flex flex-col gap-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
                   <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                   {error}
                </div>
              )}

              <div className="mt-4">
                <PrimaryButton
                  onClick={handleSignup}
                  size="lg"
                  loading={loading}
                >
                  Sign Up
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
