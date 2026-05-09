export function normalizeCompany(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function normalizeLevel(level: string): string {
  const upper = level.trim().toUpperCase();
  const match = upper.match(/L?(\d+)/);
  if (match) return `L${match[1]}`;
  return upper;
}