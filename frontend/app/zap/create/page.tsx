"use client";
import LinkButton from "@/components/buttons/LinkButton";
import AppBar from "@/components/AppBar";
import ZapCell from "@/components/ZapCell";
import React, { use } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useRouter } from "next/navigation";

function useAvailableActionsAndTriggers() {
  const Router = useRouter();
  const [availableAction, setAvailableAction] = React.useState([]);
  const [availableTriggers, setTriggerAction] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/trigger/available`)
      .then((response) => {
        console.log(response.data.data);
        setTriggerAction(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${BACKEND_URL}/api/v1/action/available`)
      .then((response) => {
        console.log(response.data.data);
        setAvailableAction(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return {
    availableAction,
    availableTriggers,
  };
}
export default function CreateZap() {
  const Router = useRouter();
  const { availableAction, availableTriggers } =
    useAvailableActionsAndTriggers();
  const [selectedTrigger, setSelectedTrigger] = React.useState<{
    id: string;
    name: string;
  }>();
  const [selectedAction, setSelectedAction] = React.useState<
    {
      index: number;
      availableActionId: string;
      availableActionName: string;
    }[]
  >([]);
  const [selectedModelIndex, setSelectedModelIndex] = React.useState<
    null | number
  >(null);
  return (
    <div>
      <AppBar />
      <div className="flex justify-end items-center px-4 py-2 bg-white shadow-md">
      
          <PrimaryButton
          
          onClick={async () => {
            if (!selectedTrigger?.id) {
              return;
            }
            console.log("Selected Trigger:", selectedTrigger);
            const response = await axios.post(
              `${BACKEND_URL}/api/v1/zap`,
              {
                "avilableTriggerId": selectedTrigger.id,
                triggerMetadata: {},
                "actions": selectedAction.map((a) => ({
                  availableactionId: a.availableActionId,
                  actionMetadata: {},
                })),
              },
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            );

            Router.push(`/dashboard`);
          }}
        >
          Publish
        </PrimaryButton>
     
      </div>
      <div className=" w-full min-h-screen bg-slate-200 flex flex-col justify-center items-center">
        <ZapCell
          name={
            selectedTrigger?.name
              ? selectedTrigger.id
              : "Trigger"
          }
          index={1}
          onClick={() => {
            setSelectedModelIndex(1);
          }}
        />

        {selectedAction.map((action, index) => {
          return (
            <div className="py-3 w-full flex justify-center">
              <ZapCell
                name={action ? action.availableActionName : "Action"}
                index={action.index}
                key={index}
                onClick={() => {
                  setSelectedModelIndex(action.index);
                }}
              />
            </div>
          );
        })}

        <LinkButton
          onClick={() => {
            setSelectedAction((a) => [
              ...a,
              {
                index: a.length + 2,
                availableActionId: "",
                availableActionName: "",
              },
            ]);
          }}
        >
          <div className="text-2xl pt-2">+</div>
        </LinkButton>
      </div>
      {selectedModelIndex && (
        <Model
          availableItems={
            selectedModelIndex == 1 ? availableTriggers : availableAction
          }
          onSelect={(props: null | { name: string; id: string }) => {
            if (props == null) {
              setSelectedModelIndex(null);
              return;
            }
            if (selectedModelIndex == 1) {
              setSelectedTrigger({
                id: props.id,
                name: props.name,
              });
              return;
            } else {
              setSelectedAction((a) => [
                ...a.slice(0, selectedModelIndex - 2),
                {
                  index: selectedModelIndex,
                  availableActionId: props.id,
                  availableActionName: props.name,
                },
                ...a.slice(selectedModelIndex - 1),
              ]);
             
              return;
            }
          }}
          index={selectedModelIndex}
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
  onSelect: (props: null | { name: string; id: string }) => void;
  availableItems: { name: string; id: string; image: string }[];
}) {
  return (
    <div>
      <div
        id="default-modal"
        aria-hidden="true"
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
      >
        <div className="relative w-full max-w-2xl p-4">
          <div className="relative bg-white rounded-lg shadow-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">
                Select {index === 1 ? "Trigger" : "Action"}
              </h3>
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Available {index === 1 ? "Triggers" : "Actions"}
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.isArray(availableItems) &&
                  availableItems.map(({ id, name, image }) => (
                    <button
                      key={id}
                      onClick={() => onSelect({ id, name })}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition w-full text-left"
                    >
                      <img
                        src={image}
                        alt={name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <span className="text-gray-800 font-medium">{name}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
