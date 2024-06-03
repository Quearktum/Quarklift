import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const addLog = (token, log) => {
  return axios.post(`${API_URL}/log`, log, {
    headers: { Authorization: token }
  });
};

export const getLogs = (token) => {
  return axios.get(`${API_URL}/logs`, {
    headers: { Authorization: token }
  });
};
