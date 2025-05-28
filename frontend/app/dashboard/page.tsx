"use client";
import AppBar from "@/components/AppBar";
import DarkButton from "@/components/buttons/DarkButton";
import { useEffect } from "react";
import axios from "axios";
import React from "react";
import { BACKEND_URL, HOOk_URL } from "../config";
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
      image: string;
    };
  }[];
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
  };
  updatedAt?: string; // optional last edit date
}

function useZaps() {
  const [loading, setLoading] = React.useState(true);
  const [zaps, setZaps] = React.useState<Zap[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/zap`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setZaps(response.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { loading, zaps };
}

export default function Dashboard() {
  const router = useRouter();
  const { loading, zaps } = useZaps();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AppBar />
      <main className="flex-1 p-6 max-w-screen-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Zaps</h1>
          <DarkButton onClick={() => router.push("/zap/create")} size="md">
            Create Zap
          </DarkButton>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Last Edited
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    WebHook URL
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {zaps.map((z, idx) => (
                  <tr
                    key={z.id}
                    className={`transition hover:bg-gray-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 flex items-center space-x-4">
                      <img
                        src={z.trigger.type.image}
                        alt={z.trigger.type.name}
                        className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm object-cover"
                      />
                      <div>
                        <div className="text-gray-800 font-medium">
                        
                        </div>
                        <div className="flex space-x-2 mt-1">
                          {z.actions.map((a) => (
                            <img
                              key={a.id}
                              src={a.type.image}
                              alt={a.type.name}
                              title={a.type.name}
                              className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {z.updatedAt
                        ? new Date(z.updatedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm break-all text-blue-600">
                      {`${HOOk_URL}/hooks/catch/${z.userId}/${z.id}`}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <LinkButton onClick={() => router.push(`/zap/${z.id}`)}>
                        View
                      </LinkButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
