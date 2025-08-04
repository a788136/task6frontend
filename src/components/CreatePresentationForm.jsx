import React from "react";

export default function CreatePresentationForm({ onCreate }) {
  const handleCreate = () => {
    onCreate("Новая презентация");
  };

  return (
    <div className="flex flex-col items-center pt-8">
      <button
        type="button"
        onClick={handleCreate}
        className="bg-white border rounded-lg w-56 h-36 flex items-center justify-center shadow hover:shadow-lg hover:bg-gray-50 transition mb-2"
        style={{ outline: "none" }}
      >
        {/* SVG-плюс цветной, как на скрине */}
        <svg width="48" height="48" viewBox="0 0 48 48">
          <rect fill="#fff" width="48" height="48" rx="0" />
          <g>
            <rect x="21" y="8" width="6" height="32" fill="#4285F4" rx="2" />
            <rect x="8" y="21" width="32" height="6" fill="#34A853" rx="2" />
            <rect x="21" y="8" width="6" height="14" fill="#EA4335" rx="2" />
            <rect x="28" y="21" width="12" height="6" fill="#FBBC05" rx="2" />
          </g>
        </svg>
      </button>
      <div className="text-center text-base font-medium text-gray-800 mt-1">
        Пустая презентация
      </div>
    </div>
  );
}
