import express from 'express';
import { spawn } from 'child_process';

const app = express();
const PORT = 3001;
let wsProcess = null;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.post('/start-server', (req, res) => {
  const { port } = req.body;
  if (!port) {
    return res.status(400).json({ error: 'Port is required' });
  }
  if (wsProcess) {
    wsProcess.kill();
  }
  wsProcess = spawn('node', ['server.js', port], { stdio: 'inherit' });
  return res.json({ message: `Websocket server started on port ${port}` });
});

app.listen(PORT, () => {
  console.log(`Server manager listening on http://localhost:${PORT}`);
});
