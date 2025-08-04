import React from "react";

export default function SlidesSidebar({
  slides,
  selectedSlideIndex,
  onSelect,
  onAdd,
  onDelete,
}) {
  return (
    <div className="w-60 bg-white border-r p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold">Слайды</div>
        <button className="bg-blue-500 text-white rounded px-3 py-1" onClick={onAdd}>
          +
        </button>
      </div>
      <ul>
        {slides.map((slide, idx) => (
          <li
            key={slide._id}
            className={`mb-2 p-2 rounded cursor-pointer ${
              idx === selectedSlideIndex ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
            }`}
            onClick={() => onSelect(idx)}
          >
            Слайд {idx + 1}
          </li>
        ))}
      </ul>
      <button
        className="mt-6 bg-red-500 text-white rounded px-4 py-1 w-full"
        onClick={onDelete}
        disabled={slides.length === 0}
      >
        Удалить выбранный
      </button>
    </div>
  );
}
