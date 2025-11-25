export function escapeCSVCell(cell: string, separator = ','): string {
  const needsQuote = cell.includes(separator) || cell.includes('"') || cell.includes('\n') || cell.includes('\r');

  return needsQuote ? `"${cell.replace(/"/g, '""')}"` : cell;
}

const MAX_FILE_NAME_LENGTH = 255;

export function generateCSVFileName(prefix: string, title: string): string {
  const cleanedTitle = title.replace(/[^a-zA-Z0-9]+/g, '-');
  const trimmedTitle = cleanedTitle.replace(/^-+|-+$/g, '');
  const maxFileNameLength = MAX_FILE_NAME_LENGTH - (prefix.length + 5);
  const truncatedTitle = trimmedTitle.slice(0, maxFileNameLength);
  return `${prefix}-${truncatedTitle}.csv`;
}
