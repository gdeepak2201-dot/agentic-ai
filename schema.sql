/*
   PostgreSQL schema for Agentic AI Symptom Checker
   ------------------------------------------------
   Table: diseases
   - id: serial primary key
   - name: text not null
   - symptoms: text[] (array of symptom strings)
   - precautions: text[] (array of precaution strings)
   - prescription: jsonb (includes medications array, dosage, duration)
*/

CREATE TABLE IF NOT EXISTS diseases (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    symptoms TEXT[] NOT NULL,
    precautions TEXT[] NOT NULL,
    prescription JSONB NOT NULL
);

-- Example seed data (derived from the existing data.json)
INSERT INTO diseases (name, symptoms, precautions, prescription) VALUES
('Common Cold',
    ARRAY['sneezing','sore throat','runny nose','cough','mild fever'],
    ARRAY['Rest','Drink plenty of fluids','Take Vitamin C','Gargle with salt water'],
    '{"medications": ["Acetaminophen (500mg)", "Cough Syrup", "Saline Nasal Spray"], "dosage": "Every 6 hours as needed", "duration": "3-5 days"}'
),
('Flu (Influenza)',
    ARRAY['high fever','muscle aches','chills','fatigue','dry cough','headache'],
    ARRAY['Stay home and rest','Hydrate well','Take antiviral medication if prescribed','Monitor temperature'],
    '{"medications": ["Oseltamivir (Tamiflu)", "Ibuprofen (400mg)", "Oral Rehydration Salts"], "dosage": "Twice daily", "duration": "5 days"}'
),
('Migraine',
    ARRAY['severe headache','nausea','sensitivity to light','sensitivity to sound','visual disturbances'],
    ARRAY['Rest in a dark, quiet room','Apply a cold compress to your forehead','Stay hydrated','Avoid known triggers like caffeine or stress'],
    '{"medications": ["Sumatriptan (50mg)", "Naproxen (500mg)", "Metoclopramide"], "dosage": "At onset of symptoms", "duration": "As needed (max 2 doses/24h)"}'
) -- Add more rows as needed
;

-- Index for fast symptom searching
CREATE INDEX IF NOT EXISTS idx_diseases_symptoms ON diseases USING GIN (symptoms);
