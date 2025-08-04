import React from "react";

export default function PresentationList({ presentations, onJoin }) {
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl mb-4">Презентации:</h2>
      <ul className="bg-white rounded shadow">
        {presentations.map(p => (
          <li key={p._id} className="p-4 border-b last:border-0 flex justify-between items-center">
            <span>{p.title} <span className="text-gray-400">({p.creatorNickname})</span></span>
            <button
              className="bg-green-600 text-white rounded px-4 py-1"
              onClick={() => onJoin(p)}
            >
              Присоединиться
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
