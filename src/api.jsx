
const api = axios.create({
  baseURL: '/api', // This will use the Vite proxy
});

export default api;
