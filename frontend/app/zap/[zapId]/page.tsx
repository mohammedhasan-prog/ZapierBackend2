"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import LinkButton from "@/components/buttons/LinkButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import AppBar from "@/components/AppBar";
import ZapCell from "@/components/ZapCell";
import { BACKEND_URL } from "@/app/config";
import Input from "@/components/Input";

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

export default function EditZap() {
  const router = useRouter();
  const params = useParams();
  const zapId = params.zapId as string;
  const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();

  const [selectedTrigger, setSelectedTrigger] = useState<null | { id: string; name: string; image: string }>(null);
  const [selectedAction, setSelectedAction] = useState<
    { index: number; availableActionId: string; availableActionName: string; image: string; metadata: any }[]
  >([]);
  const [selectedModelIndex, setSelectedModelIndex] = useState<null | number>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!zapId) return;
    axios.get(`${BACKEND_URL}/api/v1/zap/${zapId}`, {
        headers: { Authorization: localStorage.getItem("token") || "" }
    })
    .then(res => {
        const zap = res.data;
        // Map Trigger
        if (zap.trigger) {
             setSelectedTrigger({
                 id: zap.trigger.type.id,
                 name: zap.trigger.type.name,
                 image: zap.trigger.type.image
             });
        }
        // Map Actions
        if (zap.actions) {
            const mappedActions = zap.actions.map((a: any, idx: number) => ({
                index: idx + 2, // 1 is trigger
                availableActionId: a.type.id,
                availableActionName: a.type.name,
                image: a.type.image,
                metadata: a.metadata
            }));
            // Sort by sortingOrder if available, or just use index
            mappedActions.sort((a: any, b: any) => a.index - b.index);
            setSelectedAction(mappedActions);
        }
        setLoading(false);
    })
    .catch(e => {
        console.error(e);
        setLoading(false);
    })
  }, [zapId]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <AppBar />
      
      {/* Action Bar */}
      <div className="sticky top-[60px] z-40 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
         <h1 className="text-xl font-bold text-slate-800">
             {loading ? "Loading Zap..." : "Edit Zap"}
         </h1>
         <div className="flex gap-3">
            <LinkButton onClick={() => router.push("/dashboard")}>Back</LinkButton>
            {/* Update functionality not yet implemented in backend, so disabled or just for show */}
             <PrimaryButton size="md" onClick={() => alert("Update feature coming soon!")}>
              Update Zap
            </PrimaryButton> 
         </div>
      </div>

      {loading ? (
          <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
      ) : (
      /* Visual Editor Canvas */
      <div className="flex-1 w-full bg-slate-100 p-8 overflow-y-auto">
        <div className="flex flex-col items-center justify-center space-y-2">
          
          {/* Trigger Node */}
          <div className="relative group">
             <ZapCell
               name={selectedTrigger?.name || "Select Trigger"}
               image={selectedTrigger?.image}
               index={1}
               onClick={() => setSelectedModelIndex(1)}
             />
             {/* Connector Line */}
             <div className="h-8 w-0.5 bg-gray-300 mx-auto"></div>
          </div>

          {/* Action Nodes */}
          {selectedAction.map((action, idx) => (
            <div key={idx} className="relative group flex flex-col items-center">
              <ZapCell
                name={action.availableActionName || "Select Action"}
                image={action.image}
                index={action.index}
                onClick={() => setSelectedModelIndex(action.index)}
              />
              <div className="h-8 w-0.5 bg-gray-300 mx-auto"></div>
            </div>
          ))}

          {/* Add Action Button - Disabled for Edit Mode/MVP or allowed? Allowed but won't save without backend */}
          <button
            onClick={() => {
                alert("Editing structure coming soon!");
                // setSelectedAction((actions) => [
                // ...actions,
                // { index: actions.length + 2, availableActionId: "", availableActionName: "", image: "", metadata: {} },
                // ])
            }}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-dashed border-gray-300 text-gray-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-50 transition-all shadow-sm"
          >
            <span className="text-xl font-bold">+</span>
          </button>
          
        </div>
      </div>
      )}

      {selectedModelIndex !== null && (
        <Model
          index={selectedModelIndex}
          availableItems={selectedModelIndex === 1 ? availableTriggers : availableActions}
          onSelect={(props) => {
            if (!props) {
              setSelectedModelIndex(null);
              return;
            }
             // For now, just update local state, but warn user it won't persist
             // Or actually implementing it fully requires backend PUT.
             // I'll update state so they see it changes, but save will fail/alert.
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
    </div>
  );
}

function Model({
  index,
  onSelect,
  availableItems,
}: {
  index: number;
  onSelect: (props: null | { id: string; name: string; image?: string; metadata?: any }) => void;
  availableItems: { id: string; name: string; image: string }[];
}) {
  const [step, setStep] = useState(0);
  const [actionItem, setActionItem] = useState<null | { id: string; name: string; image: string }>(null);
  const isTrigger = index === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {step === 0 ? `Select ${isTrigger ? "Trigger" : "Action"}` : `Configure ${actionItem?.name}`}
            </h3>
            <p className="text-sm text-gray-500">
               {step === 0 ? "Choose an app to start automation" : "Set up your action details"}
            </p>
          </div>
          <button 
             onClick={() => onSelect(null)} 
             className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          {/* Step 1: Grid Selection */}
          {step === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableItems.map(({ id, name, image }) => (
                  <button
                    key={id}
                    onClick={() => {
                      if (isTrigger) {
                        onSelect({ id, name, image, metadata: {} });
                      } else {
                        setActionItem({ id, name, image });
                        setStep(1);
                      }
                    }}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-xl border border-gray-200 hover:border-amber-500 hover:shadow-md transition-all duration-200 group text-center"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                       <img src={image} alt={name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-gray-900 font-semibold group-hover:text-amber-700">{name}</span>
                  </button>
                ))}
              </div>
          )}

          {/* Step 2: Configuration */}
          {step === 1 && actionItem && actionItem.id === "email" && (
            <EmailSelector
              onBack={() => setStep(0)}
              onSubmit={(metadata) => onSelect({ id: actionItem.id, name: actionItem.name, image: actionItem.image, metadata })}
            />
          )}
          {step === 1 && actionItem && actionItem.id === "sol" && (
             <SolanaSelector
               onBack={() => setStep(0)}
               onSubmit={(metadata) => onSelect({ id: actionItem.id, name: actionItem.name, image: actionItem.image, metadata })}
             />
          )}
           {/* Fallback for actions with no config */}
          {step === 1 && actionItem && actionItem.id !== "email" && actionItem.id !== "sol" && (
            <div className="text-center py-10">
               <p className="text-gray-500 mb-4">No configuration needed for {actionItem.name}.</p>
               <PrimaryButton onClick={() => onSelect({ id: actionItem.id, name: actionItem.name, image: actionItem.image, metadata: {} })}>
                  Continue
               </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmailSelector({ onBack, onSubmit }: { onBack: () => void; onSubmit: (meta: any) => void }) {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
          ← Back
        </button>
      </div>
      <div className="space-y-4">
        <Input
          label="To Email"
          type="email"
          placeholder="recipient@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
         <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Example Body</label>
            <textarea
              placeholder="Enter email content..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 bg-white shadow-sm hover:border-gray-300 min-h-[120px]"
            />
         </div>
         <div className="pt-4">
            <PrimaryButton
              size="lg"
              onClick={() => onSubmit({ to: email, body })}
            >
              Confirm Action
            </PrimaryButton>
         </div>
      </div>
    </div>
  );
}

function SolanaSelector({ onBack, onSubmit }: { onBack: () => void; onSubmit: (meta: any) => void }) {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
          ← Back
        </button>
      </div>
      <div className="space-y-4">
        <Input
          label="Amount (SOL)"
          type="number"
          placeholder="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
         <Input
          label="Recipient Address"
          type="text"
          placeholder="Public Key"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
         <div className="pt-4">
            <PrimaryButton
              size="lg"
              onClick={() => onSubmit({ amount, address })}
            >
              Confirm Action
            </PrimaryButton>
         </div>
      </div>
    </div>
  );
}
