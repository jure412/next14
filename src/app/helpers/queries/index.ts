export const getDrawings = async () => {
  const response = await fetch("/api/drawings");
  const drawings = await response.json();
  return drawings;
};

export const getDrawingById = async (id: string) => {
  const response = await fetch("/api/drawings/" + id);
  const drawing = await response.json();
  return drawing;
};

export const getMe = async () => {
  const response = await fetch("/api/user");
  const me = await response.json();
  return me;
};
