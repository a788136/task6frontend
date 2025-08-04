import React, { useState } from "react";

export default function NicknameInput({ onSubmit }) {
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) onSubmit(nickname.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-16">
      <input
        type="text"
        placeholder="Введите никнейм"
        value={nickname}
        onChange={e => setNickname(e.target.value)}
        className="border rounded px-4 py-2 w-64 text-lg"
      />
      <button type="submit" className="bg-blue-600 text-white rounded px-6 py-2">
        Войти
      </button>
    </form>
  );
}
