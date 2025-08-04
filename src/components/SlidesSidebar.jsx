import React from "react";
import PlusSidebar from "../assets/2.png";

export default function SlidesSidebar({
  slides,
  selectedSlideIndex,
  onSelect,
  onAdd,
  onDelete,
  myRole,
}) {
  return (
    <div className="w-60 bg-white border-r p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold">Слайды</div>
        {myRole === "editor" && (
          <button
            className="bg-blue-500 text-white rounded px-3 py-1 cursor-pointer flex items-center justify-center"
            onClick={onAdd}
            title="Добавить слайд"
            type="button"
          >
            <img src={PlusSidebar} alt="" className="w-[20px]" />
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {slides.map((slide, idx) => {
          let text = "";
          if (slide.blocks && slide.blocks.length > 0) {
            const textBlock = slide.blocks.find(b => b.type === "text" && b.content);
            text = textBlock ? textBlock.content : "";
          }
          return (
            <li
              key={slide._id}
              className={`flex items-center p-1 rounded cursor-pointer transition ${
                idx === selectedSlideIndex
                  ? "bg-blue-100 border border-blue-400"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => onSelect(idx)}
              style={{ minHeight: 64 }}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") onSelect(idx);
              }}
            >
              {/* Только миниатюра! */}
              <div
                className="w-24 h-16 border rounded bg-gray-50 flex items-center justify-center text-xs text-gray-700 overflow-hidden"
                style={{
                  minWidth: 196,
                  minHeight: 96,
                  maxWidth: 196,
                  maxHeight: 96,
                  background: idx === selectedSlideIndex ? "#e0eaff" : undefined,
                }}
                title={text || "Пусто"}
              >
                {text ? (
                  <span className="truncate w-full px-2">{text}</span>
                ) : (
                  <span className="text-gray-300">Пусто</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {myRole === "editor" && (
        <button
          className="mt-6 bg-red-500 text-white rounded px-4 py-1 w-full cursor-pointer"
          onClick={onDelete}
          disabled={slides.length === 0}
        >
          Удалить выбранный
        </button>
      )}
    </div>
  );
}
