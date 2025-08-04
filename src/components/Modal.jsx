import React from "react";

export default function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90vw] max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-xl"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-2">
          {actions}
        </div>
      </div>
    </div>
  );
}
