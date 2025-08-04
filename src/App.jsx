import React, { useState, useEffect } from "react";
import NicknameInput from "./components/NicknameInput";
import PresentationList from "./components/PresentationList";
import CreatePresentationForm from "./components/CreatePresentationForm";
import { getPresentations, createPresentation } from "./api/presentations";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import PresentationPage from "./components/PresentationPage";

// Вынесенный Header со всеми проверками!
function Header({ nickname }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isPresentation = location.pathname.startsWith("/presentation/");

  return (
    <header className="bg-blue-700 text-white py-4 mb-8 shadow">
      <div className="container mx-auto px-4 flex justify-between items-center">
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

function HomePage({ nickname, presentations, onCreate }) {
  const navigate = useNavigate();

  const handleJoin = (presentation) => {
    navigate(`/presentation/${presentation._id}`);
  };

  return (
    <div className="container mx-auto px-4">
      <CreatePresentationForm onCreate={onCreate} />
      <PresentationList presentations={presentations} onJoin={handleJoin} />
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

  const handleCreate = async (title) => {
    const newPresentation = await createPresentation(title, nickname);
    setPresentations(prev => [...prev, newPresentation]);
  };

  if (!nickname) return <NicknameInput onSubmit={handleLogin} />;

  return (
    <BrowserRouter>
      <Header nickname={nickname} />
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                nickname={nickname}
                presentations={presentations}
                onCreate={handleCreate}
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
