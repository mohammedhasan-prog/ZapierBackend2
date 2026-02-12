"use client";
import AppBar from "@/components/AppBar";
import DarkButton from "@/components/buttons/DarkButton";
import { useEffect, useState } from "react";
import axios from "axios";
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
  updatedAt?: string;
}

function useZaps() {
  const [loading, setLoading] = useState(true);
  const [zaps, setZaps] = useState<Zap[]>([]);

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

  return { loading, zaps, setZaps };
}

export default function Dashboard() {
  const router = useRouter();
  const { loading, zaps, setZaps } = useZaps();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">


      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Zaps</h1>
            <p className="text-slate-500 mt-1">Manage your automated workflows</p>
          </div>
          <DarkButton onClick={() => router.push("/zap/create")} size="md">
            + Create Zap
          </DarkButton>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : zaps.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Zaps Yet</h3>
            <p className="text-gray-500 mb-6">Create your first automated workflow to get started.</p>
            <DarkButton onClick={() => router.push("/zap/create")} size="md">
              Create My First Zap
            </DarkButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zaps.map((z) => (
              <div 
                key={z.id} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
              >
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-4">
                     <div className="flex -space-x-3">
                        <img
                          src={z.trigger.type.image}
                          alt={z.trigger.type.name}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-white object-contain p-0.5"
                          title={`Trigger: ${z.trigger.type.name}`}
                        />
                        {z.actions.map((a) => (
                           <img
                             key={a.id}
                             src={a.type.image}
                             alt={a.type.name}
                             className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-white object-contain p-0.5"
                             title={`Action: ${a.type.name}`}
                           />
                        ))}
                     </div>
                     <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                       Active
                     </span>
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                      {z.trigger.type.name} → {z.actions.map(a => a.type.name).join(", ")}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono mt-2 bg-gray-50 p-2 rounded border border-gray-100 truncate">
                      ID: {z.id}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center text-sm">
                     <div className="text-gray-500 text-xs">
                       Last edit: {z.updatedAt ? new Date(z.updatedAt).toLocaleDateString() : "Just now"}
                     </div>
                     <div className="flex gap-2">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("Are you sure you want to delete this Zap?")) {
                                    axios.delete(`${BACKEND_URL}/api/v1/zap/${z.id}`, {
                                        headers: { Authorization: localStorage.getItem("token") || "" }
                                    })
                                    .then(() => {
                                        setZaps(prev => prev.filter(zap => zap.id !== z.id));
                                    })
                                    .catch(e => {
                                        console.error(e);
                                        alert("Failed to delete Zap");
                                    });
                                }
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Zap"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                        <LinkButton onClick={() => router.push(`/zap/${z.id}`)}>
                            Edit
                        </LinkButton>
                     </div>
                  </div>
                </div>
             ))}
          </div>
        )}
      </main>
    </div>
  );
}
