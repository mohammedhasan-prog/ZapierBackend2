"use client";

export default function Input({
  placeholder,
  type,
  label, // Fixed typo 'lable' -> 'label'
  onChange,
  value,
}: {
  placeholder: string;
  type: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700 ml-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="
          w-full px-4 py-3 rounded-xl border border-gray-200 
          focus:border-amber-600 focus:ring-2 focus:ring-amber-100 
          outline-none transition-all duration-200
          placeholder:text-gray-400 text-gray-900 bg-white
          shadow-sm hover:border-gray-300
        "
      />
    </div>
  );
}
