import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherHandler from './api/weather.js';
import dsaHandler from './api/dsa-tracker.js';
import newsHandler from './api/news.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
const app = express();
app.use(cors());

app.get('/api/weather', async (req, res) => {
  req.query = req.query || {};
  await weatherHandler(req, res);
});

app.get('/api/dsa-tracker', async (req, res) => {
  req.query = req.query || {};
  await dsaHandler(req, res);
});

app.get('/api/news', async (req, res) => {
  req.query = req.query || {};
  await newsHandler(req, res);
});

app.listen(3000, () => {
  console.log('Mock Vercel proxy running on http://localhost:3000');
});
