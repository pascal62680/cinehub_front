// Adresse de l'API (le back)
const API_URL = "http://127.0.0.1:3000";

// Envoie une requête à l'API, avec le token s'il existe
export async function apiFetch(path, options = {}) {
    const headers = { "Content-Type": "application/json" };

    const token = localStorage.getItem("token");
    if (token) {
        headers.Authorization = "Bearer " + token;
    }

    const response = await fetch(API_URL + path, { ...options, headers });
    const data = await response.json();

    return { ok: response.ok, status: response.status, data };
}
