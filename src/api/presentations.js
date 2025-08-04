const BASE_URL = import.meta.env.VITE_API_URL; // Для Vite

// Получить список презентаций
export async function getPresentations() {
  const res = await fetch(`${BASE_URL}/presentations`);
  return await res.json();
}

// Создать новую презентацию
export async function createPresentation(title, creatorNickname) {
  const res = await fetch(`${BASE_URL}/presentations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, creatorNickname }),
  });
  return await res.json();
}

// Получить одну презентацию с её слайдами
export async function getPresentationWithSlides(id) {
  const res = await fetch(`${BASE_URL}/presentations/${id}`);
  return await res.json();
}
