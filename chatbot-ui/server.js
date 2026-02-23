import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  
  // Instruct the agent to use the skill securely
  const safeMessage = message.replace(/"/g, '\\"');
  const prompt = `Use the simple-chatbot skill to answer: ${safeMessage}`;
  
  try {
    const { stdout } = await execPromise(`openclaw agent --session-id chatbot-ui --message "${prompt}" --json`);
    try {
      const data = JSON.parse(stdout);
      // OpenClaw CLI JSON output includes a 'result' object with 'payloads' array
      let replyText = stdout;
      if (data && data.result && data.result.payloads && data.result.payloads.length > 0) {
        replyText = data.result.payloads.map(p => p.text).join('\n');
      }
      res.json({ reply: replyText });
    } catch (e) {
      res.json({ reply: stdout });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('API Server running on port 3001'));
