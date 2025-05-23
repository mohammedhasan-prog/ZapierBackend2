"use client";
import AppBar from "@/components/AppBar";
import DarkButton from "@/components/buttons/DarkButton";
import { useEffect } from "react";
import axios from "axios";
import React from "react";
import { BACKEND_URL } from "../config";
import LinkButton from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";

interface Zap {
  id: string;
  triggerId: string;
  userId: number;
  actions: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    type: {
      id: string;
      name: string;
    };
  }[];
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
    };
  };
}

function useZaps() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [zaps, setZaps] = React.useState<Zap[]>([]);
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/zap`, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setZaps(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);
  return {
    loading,
    zaps,
  };
}
export default function Dashboard() {
  const router = useRouter();
  const { loading, zaps } = useZaps();
  return (
    <div className="">
      <AppBar />

      <div className="    pt-4 ">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex justify-between px-8">
            <div className="text-xl font-semibold">My Zaps</div>
            <div className="">
              <DarkButton onClick={() => {
                router.push("/zap/create");
              }} size="md">
                Create
              </DarkButton>
            </div>
          </div>
        </div>
      </div>
      {loading ? "Loading..." : <div className="max-w-screen-lg mx-auto px-8 pt-4">
        <Zaptable zaps={zaps} />  
      </div>}
    </div>
  );
}



interface ZaptableProps {
  zaps: Zap[];
}

 function Zaptable({ zaps }: ZaptableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Edit
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Running
            </th>
            <th scope="col" className=" py-3  text-xs  font-medium text-gray-500 uppercase tracking-wider">
              Go
            </th>
            <th scope="col" className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {zaps.map((z, idx) => (
            <tr key={z.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-gray-800">
                  {z.trigger.type.name}
                </span>
                <div className="mt-1 text-sm text-gray-600">
                  {z.actions.map((a) => a.type.name).join(", ")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {/* Replace with dynamic date */}
                Nov 13, 2026
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <LinkButton
                  onClick={() => router.push(`/zap/${z.id}`)}
                >
                  Go
                </LinkButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
