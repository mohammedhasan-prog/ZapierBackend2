"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LinkButton from "@/components/buttons/LinkButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import AppBar from "@/components/AppBar";
import ZapCell from "@/components/ZapCell";
import { BACKEND_URL } from "@/app/config";
import ZapBuilderModal from "@/components/zap-builder/ZapBuilderModal";
import ZapSuccessModal from "@/components/zap-builder/ZapSuccessModal";

function useAvailableActionsAndTriggers() {
  const [availableActions, setAvailableActions] = useState<Array<{ id: string; name: string; image: string }>>([]);
  const [availableTriggers, setAvailableTriggers] = useState<Array<{ id: string; name: string; image: string }>>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/trigger/available`)
      .then((res) => setAvailableTriggers(res.data.data))
      .catch(console.error);
    axios
      .get(`${BACKEND_URL}/api/v1/action/available`)
      .then((res) => setAvailableActions(res.data.data))
      .catch(console.error);
  }, []);

  return { availableActions, availableTriggers };
}

export default function CreateZap() {
  const router = useRouter();
  const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();

  const [selectedTrigger, setSelectedTrigger] = useState<null | { id: string; name: string; image: string }>(null);
  const [selectedAction, setSelectedAction] = useState<
    { index: number; availableActionId: string; availableActionName: string; image: string; metadata: any }[]
  >([]);
  const [selectedModelIndex, setSelectedModelIndex] = useState<null | number>(null);
  const [publishing, setPublishing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [publishedZapId, setPublishedZapId] = useState<string | null>(null);

  useEffect(() => {
     // Fetch user ID for webhook URL generation
     axios.get(`${BACKEND_URL}/api/v1/user`, {
        headers: { Authorization: localStorage.getItem("token") || "" }
     })
     .then(res => {
         setUserId(res.data.id || res.data.user?.id); // Adjust based on actual API response structure
     })
     .catch(e => console.error("Failed to fetch user", e));
  }, []);


  const publishZap = async () => {
    if (!selectedTrigger) {
      alert("Please select a trigger first.");
      return;
    }
    setPublishing(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/zap`,
        {
          avilableTriggerId: selectedTrigger.id,
          triggerMeta: {},
          actions: selectedAction.map((a) => ({
            availableactionId: a.availableActionId,
            actionMeta: a.metadata || {},
          })),
        },
        { headers: { Authorization: localStorage.getItem("token") || "" } }
      );
      
      if (response.data.zapId) {
          setPublishedZapId(response.data.zapId);
      } else {
          router.push("/dashboard");
      }

    } catch (error) {
      console.error(error);
      alert("Failed to publish Zap");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <AppBar />
      
      {/* Action Bar */}
      <div className="flex-none bg-white/80 backdrop-blur-md px-8 py-4 flex justify-between items-center z-20">


         <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-800">Create New Zap</h1>
            <p className="text-xs text-slate-500">Design your automated workflow</p>
         </div>
         <div className="flex gap-3">
            <LinkButton onClick={() => router.push("/dashboard")}>Cancel</LinkButton>
            <PrimaryButton size="md" onClick={publishZap} loading={publishing}>
              Publish Zap
            </PrimaryButton> 
         </div>
      </div>

      {/* Visual Editor Canvas */}
      <div className="flex-1 w-full bg-slate-50 p-8 overflow-y-auto relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">


        {/* Central Workflow Line */}
        <div className="flex flex-col items-center justify-start min-h-full py-10 space-y-4">
          
          {/* Start Point */}
           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start</div>

          {/* Trigger Node */}
          <div className="relative group">
             <ZapCell
               name={selectedTrigger?.name || "Select Trigger"}
               image={selectedTrigger?.image}
               index={1}
               onClick={() => setSelectedModelIndex(1)}
             />
          </div>

          {/* Connector */}
          <div className="h-6 w-0.5 bg-gray-300"></div>

          {/* Action Nodes */}
          {selectedAction.map((action, idx) => (
            <React.Fragment key={idx}>
                <div className="relative group flex flex-col items-center">
                <ZapCell
                    name={action.availableActionName || "Select Action"}
                    image={action.image}
                    index={action.index}
                    onClick={() => setSelectedModelIndex(action.index)}
                />
                </div>
                <div className="h-6 w-0.5 bg-gray-300"></div>
            </React.Fragment>
          ))}

          {/* Add Action Button */}
          <button
            onClick={() =>
              setSelectedAction((actions) => [
                ...actions,
                { index: actions.length + 2, availableActionId: "", availableActionName: "", image: "", metadata: {} },
              ])
            }
            className="group flex flex-col items-center justify-center gap-2 mt-2 transition-all hover:scale-105"
          >
             <div className="w-12 h-12 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-amber-500 group-hover:text-amber-500 group-hover:bg-amber-50 shadow-sm transition-all">
                <span className="text-2xl font-light leading-none mb-1">+</span>
             </div>
             <span className="text-xs text-gray-400 font-medium group-hover:text-amber-600">Add Step</span>
          </button>
          
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-6">End</div>

        </div>
      </div>

      {selectedModelIndex !== null && (
        <ZapBuilderModal
          index={selectedModelIndex}
          availableItems={selectedModelIndex === 1 ? availableTriggers : availableActions}
          onSelect={(props) => {
            if (!props) {
              setSelectedModelIndex(null);
              return;
            }
            const { id, name, image, metadata } = props;
            if (selectedModelIndex === 1) {
              setSelectedTrigger({ id, name, image: image || "" });
            } else {
              setSelectedAction((actions) => {
                const newActions = [...actions];
                const arrayIndex = selectedModelIndex - 2;
                if (newActions[arrayIndex]) {
                   newActions[arrayIndex] = {
                      index: selectedModelIndex,
                      availableActionId: id,
                      availableActionName: name,
                      image: image || "",
                      metadata: metadata || {},
                   };
                }
                return newActions;
              });
            }
            setSelectedModelIndex(null);
          }}
        />
      )}

      {publishedZapId && userId && (
          <ZapSuccessModal 
            zapId={publishedZapId} 
            userId={userId} 
            triggerId={selectedTrigger?.id}
            onClose={() => setPublishedZapId(null)}
          />
      )}
    </div>
  );
}
