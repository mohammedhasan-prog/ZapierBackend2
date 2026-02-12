"use client";
import React, { useState } from "react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import LinkButton from "@/components/buttons/LinkButton";
import axios from "axios";
import { HOOk_URL } from "@/app/config";

interface ZapSuccessModalProps {
  zapId: string;
  userId: string;
  triggerId?: string;
  onClose: () => void;
}

import { useRouter } from "next/navigation";

export default function ZapSuccessModal({ zapId, userId, triggerId, onClose }: ZapSuccessModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  
  const isEmail = triggerId === "email";
  const webhookUrl = isEmail 
     ? `zap.${zapId}@zapier.com` 
     : `${HOOk_URL}/hooks/catch/${userId}/${zapId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 flex flex-col items-center text-center">
            
            <div className={`w-16 h-16 ${isEmail ? "bg-blue-100" : "bg-green-100"} rounded-full flex items-center justify-center mb-6`}>
                <svg className={`w-8 h-8 ${isEmail ? "text-blue-600" : "text-green-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isEmail ? (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  ) : (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  )}
                </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Zap Published! 🎉</h2>
            <p className="text-gray-500 mb-8">
              {isEmail 
                ? "Your email trigger is active. Send an email to the address below." 
                : "Your automation is live. Use the webhook URL below to trigger it."}
            </p>

            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex flex-col gap-2 text-left">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isEmail ? "Inbound Email Address" : "Webhook URL"}
                </label>
                <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-sm text-slate-700 break-all bg-white border border-slate-200 p-2 rounded truncate">
                        {webhookUrl}
                    </code>
                    <button 
                        onClick={copyToClipboard}
                        className={`p-2 rounded-lg transition-all ${copied ? "bg-green-100 text-green-700" : "bg-white border border-slate-200 text-slate-600 hover:border-amber-500 hover:text-amber-600"}`}
                        title="Copy to clipboard"
                    >
                        {copied ? (
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        )}
                    </button>
                </div>
            </div>

            <div className="w-full text-left mb-8">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">How to test it</label>
                 <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto relative group">
                    <code className="text-xs font-mono text-green-400 whitespace-pre">
{isEmail ? `Send an email to:
${webhookUrl}
Subject: Test Zap
Body: Hello World` : `curl -X POST ${webhookUrl} \\
-H "Content-Type: application/json" \\
-d '{"message": "Hello World"}'`}
                    </code>
                 </div>
                 <p className="text-xs text-slate-400 mt-2">
                    Send a POST request with any JSON data to trigger your Zap.
                 </p>

                 {isEmail && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Test your Zap</h4>
                        <p className="text-xs text-blue-700 mb-3">
                           Since this is a simulated email address, use this button to send a test email payload directly to your workflow.
                        </p>
                        <PrimaryButton 
                            size="md" 
                            onClick={async () => {
                                try {
                                    await axios.post(`${HOOk_URL}/hooks/catch/${userId}/${zapId}`, {
                                        from: "demo@example.com",
                                        subject: "Test Email via Simulation",
                                        body: "This is a verified test email sent from the simulation button."
                                    });
                                    alert("Test email sent successfully! Check your worker logs.");
                                } catch (e) {
                                    alert("Failed to send test email.");
                                    console.error(e);
                                }
                            }}
                        >
                            Simulate Incoming Email
                        </PrimaryButton>
                    </div>
                 )}
            </div>

            <div className="flex gap-3 w-full">
                 <LinkButton onClick={onClose}>Close</LinkButton>
                 <div className="flex-1">
                    <PrimaryButton size="lg" onClick={() => { router.push("/dashboard"); }}>
                        Go to Dashboard
                    </PrimaryButton>
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
}
