"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LinkButton from "@/components/buttons/LinkButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import AppBar from "@/components/AppBar";
import ZapCell from "@/components/ZapCell";
import { BACKEND_URL } from "@/app/config";
import { metadata } from "@/app/layout";

function useAvailableActionsAndTriggers() {
  const [availableActions, setAvailableActions] = React.useState<Array<{ id: string; name: string; image: string }>>([]);
  const [availableTriggers, setAvailableTriggers] = React.useState<Array<{ id: string; name: string; image: string }>>([]);

  React.useEffect(() => {
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

  const [selectedTrigger, setSelectedTrigger] = React.useState<null | { id: string; name: string }>(null);
  const [selectedAction, setSelectedAction] = React.useState<
    { index: number; availableActionId: string; availableActionName: string; metadata: any }[]
  >([]);
  const [selectedModelIndex, setSelectedModelIndex] = React.useState<null | number>(null);

  const publishZap = async () => {
    if (!selectedTrigger) return;
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/zap`,
        {
          avilableTriggerId: selectedTrigger.id,
          triggerMeta: {},
          actions: selectedAction.map((a) => ({  availableactionId: a.availableActionId, actionMeta: a.metadata || {} })),
        },
        { headers: { Authorization: localStorage.getItem("token") || "" } }
      );
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <AppBar />
      <div className="flex justify-end items-center px-4 py-4 shadow-md bg-white">
        <PrimaryButton size="md" onClick={publishZap} >
          Publish
        </PrimaryButton> 
      </div>
      <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center items-center">
        <ZapCell
          name={selectedTrigger?.name || "Trigger"}
          index={1}
          onClick={() => setSelectedModelIndex(1)}
        />

        {selectedAction.map((action, idx) => (
          <div key={idx} className="py-3 w-full flex justify-center">
            <ZapCell
              name={action.availableActionName || "Action"}
              index={action.index}
              onClick={() => setSelectedModelIndex(action.index)}
            />
          </div>
        ))}

        <LinkButton
          onClick={() =>
            setSelectedAction((actions) => [
              ...actions,
              { index: actions.length + 2, availableActionId: "", availableActionName: "Action", metadata: {} },
            ])
          }
        >
          <div className="text-2xl pt-2">+</div>
        </LinkButton>
      </div>

      {selectedModelIndex !== null && (
        <Model
          index={selectedModelIndex}
          availableItems={
            selectedModelIndex === 1 ? availableTriggers : availableActions
          }
          onSelect={(props) => {
            if (!props) {
              setSelectedModelIndex(null);
              return;
            }
            const { id, name, metadata } = props;
            if (selectedModelIndex === 1) {
              setSelectedTrigger({ id, name });
            } else {
              setSelectedAction((actions) => {
                const newActions = [...actions];
                newActions[selectedModelIndex - 2] = {
                  index: selectedModelIndex,
                  availableActionId: id,
                  availableActionName: name,
                  metadata: metadata || {},
                };
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
  onSelect: (props: null | { id: string; name: string; metadata?: any }) => void;
  availableItems: { id: string; name: string; image: string }[];
}) {
  const [step, setStep] = React.useState(0);
  const [actionItem, setActionItem] = React.useState<null | { id: string; name: string }>(null);
  const isTrigger = index === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold">
              Select {isTrigger ? "Trigger" : "Action"}
            </h3>
            <button onClick={() => onSelect(null)} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>

          {/* Step 1: list */}
          {step === 0 && (
            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {availableItems.map(({ id, name, image }) => (
                  <button
                    key={id}
                    onClick={() => {
                      if (isTrigger) {
                        onSelect({ id, name, metadata: {} });
                      } else {
                        setActionItem({ id, name });
                        setStep(1);
                      }
                    }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <img src={image} alt={name} className="w-12 h-12 rounded-md" />
                    <span className="text-gray-800 font-medium">{name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: selectors */}
          {step === 1 && actionItem && actionItem.id === "email" && (
            <EmailSelector
              onBack={() => setStep(0)}
              onSubmit={(metadata) => onSelect({ id: actionItem.id, name: actionItem.name, metadata })}
            />
          )}
          {step === 1 && actionItem && actionItem.id === "sol" && (
            <SolanaSelector
              onBack={() => setStep(0)}
              onSubmit={(metadata) => onSelect({ id: actionItem.id, name: actionItem.name, metadata })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EmailSelector({ onBack, onSubmit }: { onBack: () => void; onSubmit: (meta: any) => void }) {
  const [email, setEmail] = React.useState("");
  const [body, setBody] = React.useState("");
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">Back</button>
        <h2 className="text-lg font-semibold">Email Settings</h2>
      </div>
      <input
        type="email"
        placeholder="To"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        rows={4}
      />
      <button
        onClick={() => onSubmit({ to: email, body })}
        className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}

function SolanaSelector({ onBack, onSubmit }: { onBack: () => void; onSubmit: (meta: any) => void }) {
  const [amount, setAmount] = React.useState("");
  const [address, setAddress] = React.useState("");
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">Back</button>
        <h2 className="text-lg font-semibold">Solana Settings</h2>
      </div>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <button
        onClick={() => onSubmit({ amount, address })}
        className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        Submit
      </button>
    </div>
  );
}