import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getPresentationWithSlides } from "../api/presentations";
import { updateSlide } from "../api/slides";
import SlidesSidebar from "./SlidesSidebar";
import SlideArea from "./SlideArea";
import Toolbar from "./Toolbar";

export default function PresentationPage({ nickname }) {
  const { id: presentationId } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [slides, setSlides] = useState([]);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [myRole, setMyRole] = useState("viewer");

  // История для Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(0);

  const socket = useRef(null);

  // Сброс истории при загрузке презентации
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getPresentationWithSlides(presentationId);
      setPresentation(data.presentation);
      setSlides(data.slides || []);
      setSelectedSlideIndex(0);
      setLoading(false);
      setHistory([data.slides || []]);
      setHistoryStep(1);
    }
    fetchData();
    window.scrollTo(0, 0);
  }, [presentationId]);

  // --- Сокеты (без изменений) ---
  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL.replace("/api", ""));
    socket.current.emit("join-presentation", { presentationId, nickname });

    socket.current.on("users-list", (list) => {
      setUsers(list);
      const me = list.find(u => u.nickname === nickname);
      setMyRole(me ? me.role : "viewer");
    });

    socket.current.on("role-changed", ({ nickname: n, newRole }) => {
      setUsers((prev) =>
        prev.map((u) => (u.nickname === n ? { ...u, role: newRole } : u))
      );
    });

    socket.current.on("slide-added", (slide) => {
      setSlides((prev) => [...prev, slide]);
      setSelectedSlideIndex((prev) => prev + 1);
    });

    socket.current.on("slide-deleted", ({ slideId }) => {
      setSlides((prev) => {
        const idx = prev.findIndex(s => s._id === slideId);
        const filtered = prev.filter((s) => s._id !== slideId);
        setSelectedSlideIndex((oldIdx) => {
          if (filtered.length === 0) return 0;
          if (oldIdx >= filtered.length) return filtered.length - 1;
          if (idx < oldIdx) return oldIdx - 1;
          return oldIdx;
        });
        return filtered;
      });
    });

    socket.current.on("block-updated", ({ slideId, block }) => {
      setSlides((prev) =>
        prev.map((slide) =>
          slide._id === slideId
            ? {
                ...slide,
                blocks: slide.blocks.map((b) =>
                  b._id === block._id ? { ...block } : b
                ),
              }
            : slide
        )
      );
    });

    return () => {
      socket.current.disconnect();
    };
  }, [presentationId, nickname]);

  // --- История Undo/Redo ---
  function pushHistory(nextSlides) {
    setHistory(prev => {
      const arr = prev.slice(0, historyStep);
      arr.push(nextSlides);
      return arr.slice(-50);
    });
    setHistoryStep(h => h + 1);
  }

  function handleUndo() {
    if (historyStep <= 1) return;
    setHistoryStep(h => {
      setSlides(history[h - 2]);
      return h - 1;
    });
  }

  function handleRedo() {
    if (historyStep >= history.length) return;
    setHistoryStep(h => {
      setSlides(history[h]);
      return h + 1;
    });
  }

  function setSlidesAndHistory(newSlides) {
    setSlides(newSlides);
    pushHistory(newSlides);
  }

  // --- Слайды ---
  const handleAddSlide = () => {
    const order = slides.length;
    socket.current.emit("add-slide", { presentationId, order });
  };

  const handleDeleteSlide = () => {
    if (slides.length === 0) return;
    const slideToDelete = slides[selectedSlideIndex];
    socket.current.emit("delete-slide", {
      slideId: slideToDelete._id,
      presentationId,
    });
  };

  // --- Drag & Drop блоков ---
  const handleBlockMove = (block) => {
    const currentSlide = slides[selectedSlideIndex];
    if (!currentSlide) return;
    const updatedBlocks = currentSlide.blocks.map(b =>
      b._id === block._id ? block : b
    );
    const newSlides = [...slides];
    newSlides[selectedSlideIndex] = { ...currentSlide, blocks: updatedBlocks };
    setSlidesAndHistory(newSlides);

    socket.current.emit("update-block", {
      slideId: currentSlide._id,
      block,
    });
    updateSlide(currentSlide._id, { blocks: updatedBlocks }).catch(console.error);
  };

  // --- Редактирование текста ---
  const handleTextChange = (block) => {
    handleBlockMove(block);
  };

  // --- Добавить текстовый блок ---
  const handleAddTextBlock = () => {
    const currentSlide = slides[selectedSlideIndex];
    if (!currentSlide || myRole !== "editor") return;
    const newBlock = {
      type: "text",
      content: "Новый текст",
      x: 300,
      y: 160,
      width: 180,
      height: 40,
      _id: Date.now().toString(),
    };
    const updatedBlocks = [...(currentSlide.blocks || []), newBlock];
    const updatedSlide = { ...currentSlide, blocks: updatedBlocks };
    const newSlides = [...slides];
    newSlides[selectedSlideIndex] = updatedSlide;
    setSlidesAndHistory(newSlides);
    updateSlide(currentSlide._id, { blocks: updatedBlocks }).catch(console.error);
  };

  if (loading || !presentation)
    return <div className="p-6">Загрузка...</div>;

  const selectedSlide = slides.length > 0 && slides[selectedSlideIndex] ? slides[selectedSlideIndex] : null;

  return (
    <div className="flex h-[80vh]">
      <SlidesSidebar
        slides={slides}
        selectedSlideIndex={selectedSlideIndex}
        onSelect={setSelectedSlideIndex}
        onAdd={handleAddSlide}
        onDelete={handleDeleteSlide}
        myRole={myRole}
      />
      <div className="flex flex-col flex-1 items-center">
        <Toolbar
          myRole={myRole}
          onAddTextBlock={handleAddTextBlock}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyStep > 1}
          canRedo={historyStep < history.length}
        />
        <SlideArea
          selectedSlide={selectedSlide}
          myRole={myRole}
          onTextChange={handleTextChange}
          onBlockMove={handleBlockMove}
        />
      </div>
    </div>
  );
}
