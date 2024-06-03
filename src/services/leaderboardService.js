import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getLeaderboard = (token) => {
  return axios.get(`${API_URL}/leaderboard`, {
    headers: { Authorization: token }
  });
};
