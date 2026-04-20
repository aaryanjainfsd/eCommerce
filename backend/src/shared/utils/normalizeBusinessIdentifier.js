export function normalizeBusinessIdentifier(value = "") {
    return String(value)
        .trim()
        .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_");
}