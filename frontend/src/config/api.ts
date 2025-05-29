// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove o redirecionamento automático aqui
      console.error('Não autorizado - redirecionar para login');
    }
    return Promise.reject(error);
  }
);

export default api;