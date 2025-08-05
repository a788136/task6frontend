import React, { useRef } from "react";
import { uploadImage } from "../api/upload";

export default function Toolbar({
  myRole,
  onAddTextBlock,
  onAddImageBlock,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) {
  const fileRef = useRef();

  const handleImageInput = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      onAddImageBlock(url);
    } catch (err) {
      alert('Ошибка загрузки изображения');
    }
  };

  if (myRole !== "editor") return null;
  return (
    <div className="w-full flex gap-4 bg-white shadow p-3 rounded mb-3 items-center">
      <button
        className="bg-blue-500 text-white rounded px-4 py-1"
        onClick={onAddTextBlock}
      >
        Текст
      </button>
      <button
        className="bg-green-500 text-white rounded px-4 py-1"
        onClick={() => fileRef.current.click()}
      >
        Картинка
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleImageInput}
        className="hidden"
      />
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
