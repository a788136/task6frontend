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
  const socket = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getPresentationWithSlides(presentationId);
      setPresentation(data.presentation);
      setSlides(data.slides || []);
      setSelectedSlideIndex(0);
      setLoading(false);
    }
    fetchData();
  }, [presentationId]);

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

  // Drag & Drop для блоков
  const handleBlockMove = (block) => {
    const currentSlide = slides[selectedSlideIndex];
    if (!currentSlide) return;
    const updatedBlocks = currentSlide.blocks.map(b =>
      b._id === block._id ? block : b
    );
    const newSlides = [...slides];
    newSlides[selectedSlideIndex] = { ...currentSlide, blocks: updatedBlocks };
    setSlides(newSlides);

    socket.current.emit("update-block", {
      slideId: currentSlide._id,
      block,
    });

    updateSlide(currentSlide._id, { blocks: updatedBlocks }).catch(console.error);
  };

  // Изменение текста
  const handleTextChange = (block) => {
    handleBlockMove(block);
  };

  // Добавить текстовый блок
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
      _id: Date.now().toString(), // для фронта временно, на бэке появится настоящий id
    };
    const updatedBlocks = [...(currentSlide.blocks || []), newBlock];
    const updatedSlide = { ...currentSlide, blocks: updatedBlocks };
    const newSlides = [...slides];
    newSlides[selectedSlideIndex] = updatedSlide;
    setSlides(newSlides);

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
        <Toolbar myRole={myRole} onAddTextBlock={handleAddTextBlock} />
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
