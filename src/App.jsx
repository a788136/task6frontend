// App.js
import React, { useState, useEffect } from "react";
import NicknameInput from "./components/NicknameInput";
import PresentationList from "./components/PresentationList";
import CreatePresentationForm from "./components/CreatePresentationForm";
import { getPresentations, createPresentation, deletePresentation, renamePresentation } from "./api/presentations";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import PresentationPage from "./components/PresentationPage";

function Header({ nickname }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isPresentation = location.pathname.startsWith("/presentation/");
  return (
    <header className="bg-blue-700 text-white py-4 shadow">
      <div className="div2 mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isPresentation && (
            <button
              className="bg-white text-blue-700 px-4 py-1 rounded mr-4 font-bold shadow hover:bg-blue-100 transition"
              onClick={() => navigate("/")}
            >
              ← К презентациям
            </button>
          )}
          <span className="font-bold text-xl">Collaborative Presentations</span>
        </div>
        <span>👤 {nickname}</span>
      </div>
    </header>
  );
}

// Вынесенный HomePage — можешь сделать отдельным файлом, если хочешь
function HomePage({ nickname, presentations, onCreate, onDelete, onRename }) {
  const navigate = useNavigate();

  const handleJoin = (presentation) => {
    navigate(`/presentation/${presentation._id}`);
  };

  const handleOpenInNewTab = (id) => {
    window.open(`/presentation/${id}`, "_blank");
  };

  // Вот этот хендлер теперь ждёт промис и делает переход сразу после создания
  const handleCreateAndOpen = async (title) => {
    const newPresentation = await onCreate(title);
    if (newPresentation && newPresentation._id) {
      navigate(`/presentation/${newPresentation._id}`);
    }
  };

  return (
    <div className="mx-auto">
      <CreatePresentationForm onCreate={handleCreateAndOpen} />
      <PresentationList
        presentations={presentations}
        onJoin={handleJoin}
        onRename={onRename}
        onDelete={onDelete}
        onOpenInNewTab={handleOpenInNewTab}
        currentUser={nickname}
      />
    </div>
  );
}

function App() {
  const [nickname, setNickname] = useState(() => localStorage.getItem("nickname") || "");
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    if (nickname) {
      getPresentations().then(setPresentations);
    }
  }, [nickname]);

  const handleLogin = (nick) => {
    setNickname(nick);
    localStorage.setItem("nickname", nick);
  };

  // handleCreate теперь возвращает созданную презентацию!
  const handleCreate = async (title) => {
    const newPresentation = await createPresentation(title, nickname);
    setPresentations(prev => [...prev, newPresentation]);
    return newPresentation; // ВАЖНО!
  };

  const handleDelete = async (id) => {
    await deletePresentation(id);
    setPresentations(prev => prev.filter(p => p._id !== id));
  };

  const handleRename = async (id, newTitle) => {
    const updated = await renamePresentation(id, newTitle);
    setPresentations(prev =>
      prev.map(p => (p._id === id ? { ...p, title: updated.title } : p))
    );
  };

  if (!nickname) return <NicknameInput onSubmit={handleLogin} />;

  return (
    <BrowserRouter>
      <Header nickname={nickname} />
      <div className="min-h-screen
      ">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                nickname={nickname}
                presentations={presentations}
                onCreate={handleCreate}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            }
          />
          <Route
            path="/presentation/:id"
            element={<PresentationPage nickname={nickname} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
