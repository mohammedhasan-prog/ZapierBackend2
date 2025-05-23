"use client"; 
import React from "react";
import PrimaryButton from "./buttons/PrimaryButton";
import SecondaryButton from "./buttons/SecondaryButton";
import Fetures from "./Fetures";
import { useRouter } from "next/navigation";


const Hero = () => {
    const router = useRouter();
  return (
    <div className="">
      <div className="flex justify-center ">
        <div className="text-5xl font-semibold text-center pt-8 max-w-xl  ">
          Automate as fast as you can type{" "}
        </div>
      </div>

      <div className="flex justify-center ">
        <div className="text-2xl font-medium text-center pt-8 max-w-3xl  ">
          Turn chaos into smooth operations by automating workflows yourself—no
          developers, no IT tickets, no delays. The only limit is your
          imagination.
        </div>
      </div>
      <div
        className="flex justify-center gap-4 mt-10
      "
      >
 <PrimaryButton size ="lg" onClick={() => {
    router.push("/signup")
 }}>
    Get Started free
 </PrimaryButton>
 <SecondaryButton size="lg" onClick={() => {}}>
    Contact Sales
 </SecondaryButton>
      </div> 

      <div className="flex justify-center gap-4 items-center mt-10">
<Fetures title="Free Forever" subtitle="for Core features"/>
<Fetures title="More apps" subtitle="than other platforms"/>
<Fetures title="Cutting edge" subtitle="AI Features"/>


      </div>
    </div>
  );
};

export default Hero;
