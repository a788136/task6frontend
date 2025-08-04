const BASE_URL = import.meta.env.VITE_API_URL; // Для Vite

// Получить все слайды для презентации
export async function getSlides(presentationId) {
  const res = await fetch(`${BASE_URL}/slides/presentation/${presentationId}`);
  return await res.json();
}

// Создать новый слайд
export async function createSlide(presentationId, order) {
  const res = await fetch(`${BASE_URL}/slides`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ presentationId, order }),
  });
  return await res.json();
}

// Удалить слайд
export async function deleteSlide(slideId) {
  await fetch(`${BASE_URL}/slides/${slideId}`, { method: "DELETE" });
}

// Обновить слайд
export async function updateSlide(slideId, data) {
  const res = await fetch(`${BASE_URL}/slides/${slideId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}
