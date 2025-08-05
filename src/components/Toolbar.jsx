import React from "react";

export default function Toolbar({
  myRole,
  onAddTextBlock,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) {
  if (myRole !== "editor") {
    return (
      <div className="w-full flex justify-center mb-3">
        <div
          className="rounded px-4 py-2 text-orange-800 bg-orange-100 font-semibold text-center shadow"
          style={{
            fontSize: 16,
            border: "1px solid #fbbf24",
            maxWidth: 500,
          }}
        >
          У вас нет прав для редактирования этой презентации. Просмотр только для чтения.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-4 bg-white shadow p-3 rounded mb-3">
      <button
        className="bg-blue-500 text-white rounded px-4 py-1"
        onClick={onAddTextBlock}
      >
        Текст
      </button>
      <button
        className="bg-gray-200 text-gray-700 rounded px-4 py-1"
        onClick={onUndo}
        disabled={!canUndo}
        style={{ opacity: canUndo ? 1 : 0.5 }}
      >
        ⎌ Undo
      </button>
      <button
        className="bg-gray-200 text-gray-700 rounded px-4 py-1"
        onClick={onRedo}
        disabled={!canRedo}
        style={{ opacity: canRedo ? 1 : 0.5 }}
      >
        ↻ Redo
      </button>
    </div>
  );
}
