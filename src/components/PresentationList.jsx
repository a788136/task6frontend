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
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameId, setRenameId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Открыть модалку переименования
  const handleRenameClick = (presentation) => {
    setRenameId(presentation._id);
    setRenameValue(presentation.title);
    setRenameModalOpen(true);
    setMenuOpenId(null);
  };

  // "ОК" в модалке переименования
  const handleRenameOk = () => {
    onRename(renameId, renameValue.trim());
    setRenameModalOpen(false);
  };

  // Открыть модалку удаления
  const handleDeleteClick = (presentation) => {
    setDeleteId(presentation._id);
    setDeleteModalOpen(true);
    setMenuOpenId(null);
  };

  // "ОК" в модалке удаления
  const handleDeleteOk = () => {
    onDelete(deleteId);
    setDeleteModalOpen(false);
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
    <div
      className="w-full"
      style={{
        minHeight: "60vh",
        paddingLeft: 50,
        paddingRight: 50,
        paddingBottom: 50,
        boxSizing: "border-box",
        margin: "0 auto",
        maxWidth: "100vw",
      }}
    >
      <h2 className="text-2xl mb-8 mt-10 font-bold">Презентации:</h2>
      <div className="flex flex-col w-full bg-white rounded-2xl shadow-xl">
        {/* "Шапка" */}
        <div className="flex text-gray-600 text-sm font-semibold bg-gray-50 py-3 px-8">
          <div className="flex-[2]">Название</div>
          <div className="flex-[3]">Первый слайд</div>
          <div className="flex-[2]">Владелец</div>
          <div className="flex-1 text-center">Действия</div>
        </div>
        {/* Строки */}
        {presentations.length === 0 ? (
          <div className="text-center text-gray-400 py-12 text-lg">
            Нет презентаций
          </div>
        ) : (
          presentations.map((p) => {
            const isOwner = currentUser === p.creatorNickname;
            return (
              <div
                key={p._id}
                className="flex items-center group hover:bg-blue-50 transition px-8 py-5"
                style={{
                  borderBottom: "1px solid #f4f4f5",
                  cursor: "pointer",
                }}
                onClick={() => onJoin(p)}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") onJoin(p);
                }}
              >
                {/* Название */}
                <div className="flex-[2] text-lg font-bold text-gray-900 truncate">{p.title}</div>
                {/* Первый слайд */}
                <div className="flex-[3] text-gray-700 text-base truncate">
                  {p.firstSlideText
                    ? <span className="opacity-90">{p.firstSlideText}</span>
                    : <span className="text-gray-300">Нет слайда</span>}
                </div>
                {/* Владелец */}
                <div className="flex-[2] text-gray-500 text-base">{p.creatorNickname}</div>
                {/* Действия */}
                <div className="flex-1 flex justify-center relative">
                  <button
                    className="rounded hover:bg-gray-200 transition px-2 py-1"
                    onClick={e => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === p._id ? null : p._id);
                    }}
                  >
                    ⋮
                  </button>
                  {menuOpenId === p._id && (
                    <div className="absolute right-0 top-9 z-10 bg-white border rounded-lg shadow-lg w-52 dropdown-menu">
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
                            ? () => handleDeleteClick(p)
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
            );
          })
        )}
      </div>

      {/* Модалка переименования */}
      <Modal
        open={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        title="Переименовать презентацию"
        actions={[
          <button key="cancel" className="px-4 py-1 rounded bg-gray-200" onClick={() => setRenameModalOpen(false)}>
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

      {/* Модалка подтверждения удаления */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Удалить презентацию"
        actions={[
          <button key="cancel" className="px-4 py-1 rounded bg-gray-200" onClick={() => setDeleteModalOpen(false)}>
            Отмена
          </button>,
          <button
            key="ok"
            className="px-4 py-1 rounded bg-red-600 text-white"
            onClick={handleDeleteOk}
          >
            Удалить
          </button>,
        ]}
      >
        <div>Вы действительно хотите удалить презентацию?</div>
      </Modal>
    </div>
  );
}
