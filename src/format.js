// "2026-12-01 20:30:00" → "mardi 1 décembre 2026 à 20:30"
export function formatDate(datetime) {
    const date = new Date(datetime.replace(" ", "T"));
    return date.toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    }) + " à " + date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
