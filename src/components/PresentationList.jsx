import React, { useState } from "react";
import Modal from "./Modal";

export default function PresentationList({
  presentations,
  onJoin,
  onRename,
  onDelete,
  onOpenInNewTab,
  currentUser,
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameId, setRenameId] = useState(null);

  // Открыть модалку переименования
  const handleRenameClick = (presentation) => {
    setRenameId(presentation._id);
    setRenameValue(presentation.title);
    setModalOpen(true);
    setMenuOpenId(null);
  };

  // "ОК" в модалке
  const handleRenameOk = () => {
    onRename(renameId, renameValue.trim());
    setModalOpen(false);
  };

  // Закрыть меню при клике вне
  React.useEffect(() => {
    const handler = (e) => {
      if (menuOpenId && !e.target.closest(".dropdown-menu")) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpenId]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl mb-4">Презентации:</h2>
      <div className="flex flex-wrap gap-6">
        {presentations.map((p) => {
          const isOwner = currentUser === p.creatorNickname;
          return (
            <div
              key={p._id}
              className="flex flex-col items-stretch w-64 bg-white rounded-xl shadow p-0 group relative"
            >
              {/* Миниатюра */}
              <div
                className="w-full h-24 border-b rounded-t-xl bg-gray-50 flex items-center justify-center text-xs text-gray-700 overflow-hidden"
                style={{ minHeight: 96, maxHeight: 96 }}
                title={p.firstSlideText ? p.firstSlideText : "Нет содержимого"}
              >
                {p.firstSlideText
                  ? <span className="truncate w-full px-2">{p.firstSlideText}</span>
                  : <span className="text-gray-300">Нет слайда</span>}
              </div>
              {/* Название и меню */}
              <div className="flex items-center gap-2 px-4 pt-4">
                <div className="font-semibold text-base truncate flex-1">{p.title}</div>
                <div className="relative">
                  <button
                    className="ml-1 px-2 py-1 rounded hover:bg-gray-200"
                    onClick={() => setMenuOpenId(menuOpenId === p._id ? null : p._id)}
                  >
                    ⋮
                  </button>
                  {menuOpenId === p._id && (
                    <div className="absolute right-0 top-8 z-10 bg-white border rounded shadow-lg w-52 dropdown-menu">
                      {/* Переименовать */}
                      <button
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none ${!isOwner ? "cursor-default" : ""}`}
                        style={{ pointerEvents: isOwner ? "auto" : "none" }}
                        onClick={isOwner ? () => handleRenameClick(p) : undefined}
                        tabIndex={isOwner ? 0 : -1}
                      >
                        Переименовать
                        {!isOwner && (
                          <div className="text-xs text-gray-400 mt-1">
                            Только владелец может переименовать презентацию
                          </div>
                        )}
                      </button>
                      {/* Удалить */}
                      <button
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none ${!isOwner ? "cursor-default" : ""}`}
                        style={{ pointerEvents: isOwner ? "auto" : "none" }}
                        onClick={
                          isOwner
                            ? () => {
                                setMenuOpenId(null);
                                onDelete(p._id);
                              }
                            : undefined
                        }
                        tabIndex={isOwner ? 0 : -1}
                      >
                        Удалить
                        {!isOwner && (
                          <div className="text-xs text-gray-400 mt-1">
                            Только владелец может удалить презентацию
                          </div>
                        )}
                      </button>
                      {/* Открыть в новой вкладке */}
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setMenuOpenId(null);
                          onOpenInNewTab(p._id);
                        }}
                      >
                        Открыть в новой вкладке
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Creator */}
              <div className="text-gray-400 text-xs truncate px-4 pt-1 pb-2">
                {p.creatorNickname}
              </div>
              {/* Кнопка присоединиться */}
              <div className="px-4 pb-4 pt-2">
                <button
                  className="bg-green-600 text-white rounded px-4 py-1 w-full"
                  onClick={() => onJoin(p)}
                >
                  Присоединиться
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Модалка переименования */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Переименовать презентацию"
        actions={[
          <button key="cancel" className="px-4 py-1 rounded bg-gray-200" onClick={() => setModalOpen(false)}>
            Отмена
          </button>,
          <button
            key="ok"
            className="px-4 py-1 rounded bg-blue-600 text-white"
            disabled={!renameValue.trim()}
            onClick={handleRenameOk}
          >
            Ок
          </button>,
        ]}
      >
        <input
          className="border w-full px-3 py-2 rounded"
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          autoFocus
        />
      </Modal>
    </div>
  );
}
