import React from "react";

export default function Toolbar({ myRole, onAddTextBlock }) {
  if (myRole !== "editor") return null;
  return (
    <div className="w-full flex gap-4 bg-white shadow p-3 rounded mb-3">
      <button
        className="bg-blue-500 text-white rounded px-4 py-1"
        onClick={onAddTextBlock}
      >
        Текст
      </button>
      {/* ...добавь еще инструменты, если надо */}
    </div>
  );
}
