import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

import dotenv from 'dotenv';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  authStrategy: new LocalAuth()
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('📲 Scan QR dengan WhatsApp kamu!');
});

client.on('ready', () => {
  console.log('✅ Bot WA aktif dan siap digunakan!');
});

client.on('message', async (message) => {
  const prompt = message.body;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    message.reply(response);
  } catch (err) {
    console.error(err);
    message.reply('❌ Maaf, terjadi kesalahan saat menjawab.');
  }
});

client.initialize();

app.get('/', (req, res) => {
  res.send('🤖 Bot WA Gemini aktif!');
});

app.listen(port, () => {
  console.log(`🌐 Server berjalan di http://localhost:${port}`);
});
