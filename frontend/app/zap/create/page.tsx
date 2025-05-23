
"use client";
import LinkButton from "@/components/buttons/LinkButton";
import AppBar from "@/components/AppBar"
import ZapCell from "@/components/ZapCell";
import React from "react";
export default function CreateZap() {
  const [selectedTrigger, setSelectedTrigger] = React.useState("");
  const [selectedAction, setSelectedAction] = React.useState<{
    availableActionId:string,
    availableActionName:string
  }[]>([]);
    return <div>
        <AppBar/>
        <div className=" w-full min-h-screen bg-slate-200 flex flex-col justify-center items-center"> 
<ZapCell name={selectedTrigger? selectedTrigger : "Trigger"} index={1}/>

            {
                selectedAction.map((action, index) => {
                    return <div className="py-3 w-full flex justify-center"><ZapCell  name={action? action.availableActionName : "Action"} index={index + 2} key={index}/></div>
                })
            }

<LinkButton onClick={() => {
    setSelectedAction(a=> [...a, {availableActionId: "", availableActionName: ""}])
}}><div className="text-2xl pt-2">
    +</div></LinkButton>
  
        </div>
        </div>
} 