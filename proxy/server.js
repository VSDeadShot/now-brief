import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handler from './api/weather.js';

dotenv.config();
const app = express();
app.use(cors());

app.get('/api/weather', async (req, res) => {
  // Mock Vercel serverless request/response
  await handler(req, res);
});

app.listen(3000, () => {
  console.log('Mock Vercel proxy running on http://localhost:3000');
});
