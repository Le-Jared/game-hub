import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.vercel.app', 'https://game-hub-coral.vercel.app'] 
    : 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

async function generateConnectionGroups() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Generate exactly 16 connection groups as a JSON array. Format:
[
  {
    "category": "CATEGORY NAME",
    "words": ["WORD1", "WORD2", "WORD3", "WORD4"],
    "color": "#COLOR"
  }
]

Rules:
1. Use ONLY these colors: #FDB347, #B7A5DE, #85C0F9, #F9A58B
2. ALL text must be in UPPERCASE
3. Each group MUST have exactly 4 words
4. No duplicate words or categories
5. Return ONLY valid JSON, no explanations or additional text`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    if (text.includes('[')) {
      text = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Received text:', text);
      throw new Error('Invalid JSON response');
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }

    const validColors = ['#FDB347', '#B7A5DE', '#85C0F9', '#F9A58B'];
    
    const validGroups = parsed.filter(group => {
      try {
        return (
          group.category &&
          typeof group.category === 'string' &&
          Array.isArray(group.words) &&
          group.words.length === 4 &&
          group.words.every(word => typeof word === 'string') &&
          validColors.includes(group.color)
        );
      } catch (e) {
        return false;
      }
    });

    if (validGroups.length < 4) {
      throw new Error('Not enough valid groups generated');
    }

    return validGroups;
  } catch (error) {
    console.error('Generation Error:', error);
    throw error;
  }
}

// Cache for storing generated groups
let connectionCache = [];

app.get('/api/connections', async (req, res) => {
  try {
    if (connectionCache.length < 4) {
      try {
        const newConnections = await generateConnectionGroups();
        connectionCache = [...connectionCache, ...newConnections];
      } catch (error) {
        console.error('Cache replenishment error:', error);
        if (connectionCache.length < 4) {
          throw error;
        }
      }
    }

    const groupsToSend = connectionCache.splice(0, 4);
    res.json(groupsToSend);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Failed to generate connections',
      details: error.message
    });
  }
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.status(404).send('Not found');
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
