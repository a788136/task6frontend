import React, { useState, useRef } from "react";
import { Stage, Layer, Text } from "react-konva";

export default function SlideArea({
  selectedSlide,
  myRole,
  onTextChange,
  onBlockMove,
}) {
  const [editing, setEditing] = useState(null); // { block, x, y, value }
  const inputRef = useRef(null);
  const slideAreaRef = useRef(null); // ССЫЛКА на контейнер

  // Вызовем input ровно на тексте
  const handleTextClick = (block, idx, e) => {
    if (myRole !== "editor") return;
    // Получаем координаты блока относительно slideArea
    const containerRect = slideAreaRef.current.getBoundingClientRect();
    const stageRect = e.target.getStage().container().getBoundingClientRect();
    // Позиция input относительно контейнера
    const x = stageRect.left + block.x - containerRect.left;
    const y = stageRect.top + block.y - containerRect.top;
    setEditing({
      block,
      x,
      y,
      width: block.width || 180,
      height: block.height || 40,
      value: block.content,
      idx,
    });
    setTimeout(() => inputRef.current && inputRef.current.focus(), 10);
  };

  if (!selectedSlide) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 relative">
        <div className="w-[800px] h-[400px] bg-white rounded shadow-lg flex flex-col items-center justify-center">
          <div className="text-gray-500 text-center w-full">
            Нет слайда. Добавьте новый слайд!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center relative"
      style={{ minHeight: 420 }}
    >
      {/* === ВАЖНО! Здесь ref === */}
      <div
        ref={slideAreaRef}
        className="w-[800px] h-[400px] bg-white rounded shadow-lg flex flex-col items-center justify-center relative"
        style={{ position: "relative" }}
      >
        <Stage width={800} height={400}>
          <Layer>
            {selectedSlide.blocks &&
              selectedSlide.blocks.map((block, idx) =>
                block.type === "text" ? (
                  <Text
                    key={block._id || idx}
                    x={block.x}
                    y={block.y}
                    text={block.content}
                    fontSize={20}
                    draggable={myRole === "editor"}
                    onClick={e => handleTextClick(block, idx, e)}
                    onDragEnd={e => {
                      if (myRole === "editor") {
                        onBlockMove({
                          ...block,
                          x: e.target.x(),
                          y: e.target.y(),
                        });
                      }
                    }}
                    style={{
                      cursor:
                        myRole === "editor"
                          ? editing && editing.idx === idx
                            ? "text"
                            : "pointer"
                          : "default",
                    }}
                  />
                ) : null
              )}
          </Layer>
        </Stage>

        {/* Input-поле поверх канвы */}
        {editing && (
          <input
            ref={inputRef}
            style={{
              position: "absolute",
              left: editing.x,
              top: editing.y,
              width: editing.width,
              height: editing.height,
              fontSize: 20,
              border: "1px solid #4285F4",
              background: "white",
              padding: 2,
              outline: "none",
              zIndex: 100,
              color: "#222",
              cursor: "text",
              boxShadow: "0 0 0 2px #4285f444",
              borderRadius: 6,
            }}
            value={editing.value}
            onChange={e =>
              setEditing(edit => ({ ...edit, value: e.target.value }))
            }
            onBlur={() => {
              onTextChange({ ...editing.block, content: editing.value });
              setEditing(null);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                onTextChange({ ...editing.block, content: editing.value });
                setEditing(null);
              }
            }}
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
