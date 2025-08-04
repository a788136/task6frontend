import React from "react";

export default function UsersSidebar({
  users,
  myRole,
  nickname,
  creatorNickname,
  onChangeRole,
}) {
  return (
    <div className="w-60 bg-white border-l p-4 flex flex-col">
      <div className="font-bold mb-2">Пользователи</div>
      <ul>
        {users.length === 0 && <li className="text-gray-500">Пока что никого</li>}
        {users.map((user, i) => (
          <li key={i} className="mb-2 flex items-center gap-2">
            {/* ONLINE-ИНДИКАТОР */}
            <span
              title={user.online ? "Онлайн" : "Оффлайн"}
              className={`w-2 h-2 rounded-full inline-block ${
                user.online === false
                  ? "bg-gray-300"
                  : "bg-green-500"
              }`}
            />
            <span>{user.nickname}</span>
            <span className="text-xs text-gray-400">({user.role || "viewer"})</span>
            {creatorNickname === nickname && user.nickname !== nickname && (
              <button
                className="text-xs ml-2 px-2 py-0.5 rounded border"
                onClick={() =>
                  onChangeRole(user, user.role === "editor" ? "viewer" : "editor")
                }
              >
                {user.role === "editor" ? "Viewer" : "Editor"}
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 text-sm text-blue-900">
        Вы: {nickname} <b>({myRole})</b>
      </div>
    </div>
  );
}
