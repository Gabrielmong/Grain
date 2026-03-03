const API_URL = import.meta.env.VITE_API_URL?.replace('/graphql', '') || 'http://localhost:4000';

export async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
  const token = localStorage.getItem('authToken');
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/upload?folder=${folder}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Upload failed');
  }

  const data = await res.json();
  return data.url as string;
}
