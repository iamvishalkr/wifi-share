export const getOrigin = async () => {
  if (import.meta.env.DEV) {
    const ipv4 = import.meta.env.VITE_IPV4; /** dev mode: use local ipv4 using ipconfig command from cmd */
    const res = await fetch("http://localhost:53314/get-ws-port");
    const data = await res.json();
    return `${ipv4}:${data.port}`;
  }
  return window.location.origin; /** production */
};
