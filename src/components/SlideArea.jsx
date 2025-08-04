import React from "react";

export default function SlideArea({ selectedSlide, myRole, onTextChange }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 relative">
      <div className="w-[800px] h-[400px] bg-white rounded shadow-lg flex flex-col items-center justify-center">
        {selectedSlide ? (
          <textarea
            className="w-full h-full resize-none outline-none border-none text-lg p-8"
            placeholder="Введите текст слайда"
            value={
              selectedSlide.blocks && selectedSlide.blocks.length > 0
                ? selectedSlide.blocks[0].content
                : ""
            }
            onChange={onTextChange}
            disabled={myRole !== "editor"}
          />
        ) : (
          <div className="text-gray-500 text-center w-full">
            Нет слайда. Добавьте новый слайд!
          </div>
        )}
      </div>
    </div>
  );
}
