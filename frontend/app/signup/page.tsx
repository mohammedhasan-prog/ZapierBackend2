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
  return (
    <div className="">
      <AppBar />
      <div className="flex  justify-center items-center">
        <div className=" flex   pt-20  max-w-4xl justify-center  ">
          <div className="flex-1 pt-10 px-4 ">
            <div className=" font-semibold text-3xl  pb-4 ">
              Join millions of people who are automating their work with us
            </div>
            <div className="pl-2 pt-2 flex flex-col gap-3 ">
              <CheckFeature title={"Easy Setup,no Coding required"} />
              <CheckFeature title={"Free forever for core features"} />
              <CheckFeature title={"14 day free trial"} />
            </div>
          </div>
          <div className="flex-1 p-4 border-2 border-gray-300 rounded-lg">
            <div className="flex flex-col gap-4 ">
              <Input
                lable={"Your Name"}
                type={"text"}
                placeholder={"Your Name"}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Input
                lable="Email"
                type="text"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <Input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                lable="password"
                placeholder="Your Name"
              />
            </div>

            <div className="text-center items-center justify-center  w-auto mt-4 ">
              <PrimaryButton
                onClick={async () => {
                  console.log(BACKEND_URL);
                  const res = await axios.post(
                    `${BACKEND_URL}/api/v1/user/signup`,
                    {
                      name,
                      email,
                      password,
                    }
                  );

                  router.push("/login");
                }}
                size="lg"
                children={"Sign Up"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
