const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export async function checkApiKeyStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    const data = await res.json();
    return { ok: data.apiKeyConfigured, message: data.message };
  } catch {
    return { ok: false, message: 'API server not reachable' };
  }
}

export async function extractManagementReport(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/api/extract/management-report`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error((await res.json()).error || 'Extraction failed');
  return res.json();
}

export async function extractRentRoll(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/api/extract/rent-roll`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error((await res.json()).error || 'Extraction failed');
  return res.json();
}

export async function extractBudget(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/api/extract/budget`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error((await res.json()).error || 'Extraction failed');
  return res.json();
}
