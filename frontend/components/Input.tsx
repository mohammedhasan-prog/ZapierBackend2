"use client"
export default function Input({
  placeholder,
  type,
  lable,
  onChange,
}: {
  placeholder: string;
  type: string;
  lable: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
   <div>
    <div>{lable}</div>
     <input
      type={type}
      placeholder={placeholder}
      
      onChange={onChange}
      className="border-2 border-gray-300 rounded-lg p-2 w-full"
    />
   </div>
  );
}
