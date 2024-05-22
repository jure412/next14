export const getDrawings = async (
  url: string = "/api/drawings",
  options?: RequestInit
): Promise<any> => {
  const response = options ? await fetch(url, options) : await fetch(url);
  const drawings = await response.json();
  return drawings;
};

export const getDrawingById = async (
  id: string,
  url: string = "/api/drawings/",
  options?: RequestInit
): Promise<any> => {
  const response = options
    ? await fetch(url + id, options)
    : await fetch(url + id);
  const drawing = await response.json();
  return drawing;
};

export const getMe = async (
  url: string = "/api/user",
  options?: RequestInit
): Promise<any> => {
  const response = options ? await fetch(url, options) : await fetch(url);
  const me = await response.json();
  return me;
};

export const getUserById = async (
  email: string,
  url: string = "/api/user/",
  options?: RequestInit
): Promise<any> => {
  const response = options
    ? await fetch(url + email, options)
    : await fetch(url + email);
  const user = await response.json();
  return user;
};
