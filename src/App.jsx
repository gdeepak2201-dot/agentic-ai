import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  RotateCcw,
  ArrowRight,
  BrainCircuit,
  Pill,
  Clock,
  Shield,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const API_URL = import.meta.env.PROD ? '/api/diagnose' : 'http://localhost:5000/api/diagnose';

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [thoughts, setThoughts] = useState([]);
  const [error, setError] = useState('');

  const diagnose = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setResult(null);
    setThoughts([]);
    setError('');

    try {
      const { data } = await axios.post(API_URL, { symptoms });

      if (data.thoughts) {
        for (let i = 0; i < data.thoughts.length; i++) {
          setThoughts(prev => [...prev, data.thoughts[i]]);
          await new Promise(r => setTimeout(r, 600));
        }
      }

      setResult(data);
    } catch (err) {
      setError('System unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setThoughts([]);
    setSymptoms('');
    setError('');
  };

  return (
    <div className="app-container">
      <header>
        <h1>Agentic AI</h1>
        <p>Intelligent Medical Symptom Analysis</p>
      </header>

      <main>
        {!result ? (
          <div className="card">
            <label className="label">Describe your symptoms</label>
            <textarea
              className="input-field"
              placeholder="e.g. fever, headache, cough..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              disabled={loading}
            />

            {error && <div className="error-msg flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}

            <AnimatePresence>
              {thoughts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="reasoning-list"
                >
                  <div className="label !mb-3 flex items-center gap-2">
                    <BrainCircuit size={16} className="text-blue-600" />
                    Agent Reasoning
                  </div>
                  {thoughts.map((thought, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="reasoning-step"
                    >
                      <CheckCircle2 size={14} className="text-green-500" />
                      {thought}
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="reasoning-step">
                      <Loader2 size={14} className="spinner text-blue-500" />
                      Processing...
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={diagnose}
              className="btn"
              disabled={loading || !symptoms.trim()}
            >
              {loading ? <Loader2 className="spinner" /> : <>Start Analysis <ArrowRight size={18} /></>}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="result-header">
              <span className="badge">Analysis Complete</span>
              <h2>{result.disease}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <Activity size={14} /> Confidence: {result.confidence}%
              </div>
            </div>

            <div className="mb-8">
              <h3 className="section-title"><Shield size={18} className="text-blue-600" /> Recommended Precautions</h3>
              {result.precautions.map((p, i) => (
                <div key={i} className="list-item">{p}</div>
              ))}
            </div>

            {result.prescription && (
              <div className="prescription-box">
                <h3 className="section-title text-amber-800"><Pill size={18} className="text-amber-600" /> Suggested Protocol</h3>
                <div className="mb-4">
                  <span className="label !text-amber-800/60 !mb-1">Medications</span>
                  <div className="flex flex-wrap -ml-1">
                    {result.prescription.medications.map((m, i) => (
                      <span key={i} className="medication-tag">{m}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-8">
                  <div>
                    <span className="label !text-amber-800/60 !mb-1">Dosage</span>
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
                      <Clock size={14} /> {result.prescription.dosage}
                    </div>
                  </div>
                  <div>
                    <span className="label !text-amber-800/60 !mb-1">Duration</span>
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
                      <Activity size={14} /> {result.prescription.duration}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button onClick={reset} className="btn !bg-slate-100 !text-slate-900 mt-8 border border-slate-200 hover:bg-slate-200">
              <RotateCcw size={18} /> New Analysis
            </button>
          </motion.div>
        )}
      </main>

      <footer>
        <p><strong>DISCLAIMER:</strong> </p>
        <p></p>
      </footer>
    </div>
  );
}

export default App;
