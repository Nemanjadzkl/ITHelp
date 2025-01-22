// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const tasksFile = path.join(__dirname, 'public', 'tasks.json');

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors({
  origin: 'http://localhost:5173', // Vite development server
  credentials: true
}));

// SSE endpoint za automatsko ažuriranje
app.get('/api/tasks/updates', (req, res) => {
  console.log('SSE connection established');
  
  // Postavljamo zaglavlja za SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Funkcija za slanje podataka klijentu
  const sendData = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Slanje početnih podataka
  const sendInitialData = () => {
    fs.readFile(tasksFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading tasks file:', err);
        return;
      }
      sendData(JSON.parse(data));
    });
  };

  sendInitialData();

  // Pratimo promene u tasks.json fajlu
  const watcher = fs.watch(tasksFile, (eventType) => {
    if (eventType === 'change') {
      fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading tasks file:', err);
          return;
        }
        sendData(JSON.parse(data));
      });
    }
  });

  // Zatvaranje veze
  req.on('close', () => {
    console.log('SSE connection closed');
    watcher.close();
  });
});

// GET endpoint za dobijanje zadataka
app.get('/api/tasks', (req, res) => {
  console.log('GET /api/tasks request received');
  fs.readFile(tasksFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading tasks file:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    console.log('Sending tasks data:', data);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

// POST endpoint za ažuriranje zadataka
app.post('/api/tasks', (req, res) => {
  console.log('POST /api/tasks request received');
  fs.writeFile(tasksFile, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error('Error writing tasks file:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.sendStatus(200);
  });
});

// Pokretanje servera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});