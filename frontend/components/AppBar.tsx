"use client"; 
import React from "react";
import LinkButton from "./buttons/LinkButton";
import PrimaryButton from "./buttons/PrimaryButton";
import { useRouter } from "next/navigation";


const AppBar = () => {
    const router = useRouter();
  return (
    <div className="flex border-b justify-between ">
      <div className="flex flex-col justify-center p-4 text-2xl font-semibold">Zapier</div>
      <div className="flex p-2 gap-2">
        <LinkButton onClick={()=>{}}>Contact Sales</LinkButton>
        <LinkButton onClick={()=>{router.push("/login")}}>Login</LinkButton>
        <PrimaryButton size="sm" onClick={()=>{router.push("/signup")}}>Sign Up</PrimaryButton>
      </div>
    </div>
  );
};

export default AppBar;
