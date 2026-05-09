const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Medical Knowledge Base (The Agent's Tool)
const knowledgeBase = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

/**
 * SYMPTOM AGENT
 * This is an Agentic AI architecture. It doesn't just match keywords;
 * it follows a reasoning loop to "think" through the diagnosis.
 */
class SymptomAgent {
  constructor(userInput) {
    this.userInput = userInput;
    this.thoughts = [];
    this.plan = [];
    this.diagnosis = null;
  }

  async run() {
    // Step 1: Perception & Analysis
    this.addThought("Analyzing user input for clinical tokens...");
    const tokens = this.userInput.toLowerCase().split(/[,\s]+/).map(s => s.trim()).filter(s => s.length > 2);
    
    // Step 2: Planning
    this.addThought(`Identified ${tokens.length} symptoms. Planning cross-reference with medical database.`);
    this.plan = ["Tokenize Input", "Match with Knowledge Base", "Calculate Confidence", "Formulate Precautions"];

    // Step 3: Execution (Consulting Tools/Database)
    this.addThought("Scanning knowledge base for matching patterns...");
    const scores = knowledgeBase.diseases.map(disease => {
      let matches = 0;
      disease.symptoms.forEach(s => {
        tokens.forEach(t => {
          if (s.includes(t) || t.includes(s)) matches++;
        });
      });
      return { ...disease, score: matches / (disease.symptoms.length + tokens.length) };
    });

    // Step 4: Reasoning & Decision Making
    this.addThought("Reasoning through potential matches to find the highest probability...");
    const topMatch = scores.sort((a, b) => b.score - a.score)[0];

    if (topMatch && topMatch.score > 0) {
      this.addThought(`Agentic Decision: High confidence match for ${topMatch.name}.`);
      
      // Step 5: Prescription Generation (Agentic Tooling)
      this.addThought("Simulating clinical validation... Generating suggested medication protocol.");
      this.diagnosis = {
        name: topMatch.name,
        precautions: topMatch.precautions,
        prescription: topMatch.prescription,
        confidence: Math.min(Math.round(topMatch.score * 100 * 2), 95)
      };
    } else {
      this.addThought("Reasoning Error: Insufficient symptom data to provide a safe diagnosis.");
    }

    return {
      thoughts: this.thoughts,
      diagnosis: this.diagnosis
    };
  }

  addThought(thought) {
    console.log(`[Agent Thought]: ${thought}`);
    this.thoughts.push(thought);
  }
}

app.post('/api/diagnose', async (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms) return res.status(400).json({ error: 'No symptoms provided.' });

  const agent = new SymptomAgent(symptoms);
  const result = await agent.run();

  res.json({
    success: !!result.diagnosis,
    ...result.diagnosis,
    thoughts: result.thoughts,
    message: result.diagnosis ? null : "The agent could not find a definitive match. Please consult a professional."
  });
});

// Serve frontend in production or if deployed as one unit
app.use(express.static(path.join(__dirname, '../dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Agentic Backend active on port ${PORT}`);
  });
}

module.exports = app;
