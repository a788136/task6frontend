import React, { useState } from "react";

export default function CreatePresentationForm({ onCreate }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title.trim());
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-6">
      <input
        type="text"
        placeholder="Название новой презентации"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
        Создать
      </button>
    </form>
  );
}
