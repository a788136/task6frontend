export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return await res.json();
}
