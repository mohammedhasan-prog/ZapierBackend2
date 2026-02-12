"use client";
import React, { useState, useEffect } from "react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import Input from "@/components/Input";

export interface ZapBuilderModalProps {
  index: number;
  onSelect: (props: null | { id: string; name: string; image?: string; metadata?: any }) => void;
  availableItems: { id: string; name: string; image: string }[];
}

export default function ZapBuilderModal({
  index,
  onSelect,
  availableItems,
}: ZapBuilderModalProps) {
  const [step, setStep] = useState(0);
  const [selectedItem, setSelectedItem] = useState<null | { id: string; name: string; image: string }>(null);
  const isTrigger = index === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {step === 0 ? `Select ${isTrigger ? "Trigger" : "Action"}` : `Configure ${selectedItem?.name}`}
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
                        setSelectedItem({ id, name, image });
                        setStep(1);
                      }
                    }}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-xl border border-gray-200 hover:border-amber-500 hover:shadow-md transition-all duration-200 group text-center"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform p-2">
                       <img src={image} alt={name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-gray-900 font-semibold group-hover:text-amber-700">{name}</span>
                  </button>
                ))}
              </div>
          )}

          {/* Step 2: Configuration */}
          {step === 1 && selectedItem && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 {selectedItem.id === "email" && !isTrigger ? (
                    <EmailSelector
                      onBack={() => setStep(0)}
                      onSubmit={(metadata) => onSelect({ id: selectedItem.id, name: selectedItem.name, image: selectedItem.image, metadata })}
                    />
                 ) : selectedItem.id === "sol" || selectedItem.id === "send-sol" ? (
                     <SolanaSelector
                       onBack={() => setStep(0)}
                       onSubmit={(metadata) => onSelect({ id: selectedItem.id, name: selectedItem.name, image: selectedItem.image, metadata })}
                     />
                 ) : selectedItem.id === "gmail" ? (
                      <GmailSelector
                       onBack={() => setStep(0)}
                       onSubmit={(metadata) => onSelect({ id: selectedItem.id, name: selectedItem.name, image: selectedItem.image, metadata })}
                     />
                 ) : selectedItem.id === "email" && isTrigger ? (
                      <EmailTriggerSelector
                       onBack={() => setStep(0)}
                       onSubmit={(metadata) => onSelect({ id: selectedItem.id, name: selectedItem.name, image: selectedItem.image, metadata })}
                     />
                 ) : (
                    <div className="text-center py-10">
                       <p className="text-gray-500 mb-4">No configuration needed for {selectedItem.name}.</p>
                       <PrimaryButton onClick={() => onSelect({ id: selectedItem.id, name: selectedItem.name, image: selectedItem.image, metadata: {} })}>
                          Continue
                       </PrimaryButton>
                    </div>
                 )}
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
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium">
          ← Back to selection
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
            <label className="text-sm font-semibold text-gray-700 ml-1">Email Body</label>
            <textarea
              placeholder="Enter email content..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 bg-white shadow-sm hover:border-gray-300 min-h-[120px]"
            />
         </div>
         <div className="pt-4 flex justify-end">
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
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium">
          ← Back to selection
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
         <div className="pt-4 flex justify-end">
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

function GmailSelector({ onBack, onSubmit }: { onBack: () => void; onSubmit: (meta: any) => void }) {
  const [connected, setConnected] = useState(false);
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium">
          ← Back to selection
        </button>
      </div>
      <div className="space-y-6">
         {!connected ? (
             <div className="text-center space-y-4 py-4">
                 <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                    <img src="https://cdn-icons-png.flaticon.com/512/5968/5968534.png" className="w-8 h-8"/>
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-gray-900">Connect Gmail</h3>
                    <p className="text-sm text-gray-500">Allow Zapier to access your emails.</p>
                 </div>
                 <PrimaryButton onClick={() => setConnected(true)}>
                    Sign in with Google
                 </PrimaryButton>
             </div>
         ) : (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                 <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Account Connected: user@example.com
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Trigger Event</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none transition-all appearance-none cursor-pointer">
                        <option value="new_email">New Email Matching Search</option>
                        <option value="new_thread">New Thread</option>
                    </select>
                 </div>

                 <div className="pt-4 flex justify-end">
                    <PrimaryButton
                    size="lg"
                    onClick={() => onSubmit({ triggerType: "new_email" })}
                    >
                    Continue
                    </PrimaryButton>
                </div>
             </div>
         )}
      </div>
    </div>
  );
}

function EmailTriggerSelector({ onBack, onSubmit }: { onBack: () => void; onSubmit: (meta: any) => void }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium">
          ← Back to selection
        </button>
      </div>
      <div className="space-y-6">
         <div className="text-center space-y-4 py-4">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                <img src="https://cdn-icons-png.flaticon.com/512/281/281769.png" className="w-8 h-8"/>
             </div>
             <div>
                <h3 className="text-lg font-bold text-gray-900">Email by Zapier</h3>
                <p className="text-sm text-gray-500">Trigger flows when you receive an email.</p>
             </div>
         </div>
         
         <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Trigger Event</label>
            <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700">
                New Inbound Email
            </div>
            <p className="text-xs text-gray-500">You'll receive a custom email address after publishing.</p>
         </div>

         <div className="pt-4 flex justify-end">
            <PrimaryButton
            size="lg"
            onClick={() => onSubmit({ triggerType: "inbound_email" })}
            >
            Continue
            </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
