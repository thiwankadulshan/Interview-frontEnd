export const sanitizeSql = (input: string): string => {
  if (!input) return "";
  
  return input
    .replace(/'/g, "''")
    .replace(/--/g, "")
    .replace(/;/g, "")
    .trim();
};

export const sanitizeXss = (input: string): string => {
  if (!input) return "";

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .trim();
};
