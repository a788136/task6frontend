const BASE_URL = import.meta.env.VITE_API_URL;

export async function getPresentations() {
  const res = await fetch(`${BASE_URL}/presentations`);
  return await res.json();
}

export async function createPresentation(title, creatorNickname) {
  const res = await fetch(`${BASE_URL}/presentations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, creatorNickname }),
  });
  return await res.json();
}

export async function getPresentationWithSlides(id) {
  const res = await fetch(`${BASE_URL}/presentations/${id}`);
  return await res.json();
}

export async function deletePresentation(id) {
  const res = await fetch(`${BASE_URL}/presentations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Ошибка удаления презентации");
}

export async function renamePresentation(id, newTitle) {
  const res = await fetch(`${BASE_URL}/presentations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle }),
  });
  if (!res.ok) throw new Error("Ошибка переименования");
  return await res.json();
}
