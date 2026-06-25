import React, { useState } from 'react';
import TrainingForm from './components/TrainingForm.jsx';
import TrainingPlan from './components/TrainingPlan.jsx';
import { libraryStats, trainingLibrary } from './data/trainingLibrary.js';

const phaseLabels = ['Aktivierung', 'Technik', 'Spielform', 'Abschlussspiel', 'Abschluss'];
const phaseOrder = ['activation', 'technique', 'gameform', 'finalgame', 'cooldown'];

const focusMap = {
  Passspiel: 'passspiel',
  Dribbling: 'dribbling',
  Torabschluss: 'torabschluss',
  Umschalten: 'umschalten',
  Koordination: 'koordination',
};

const levelMap = {
  Einsteiger: 'einsteiger',
  Fortgeschritten: 'fortgeschritten',
  Leistung: 'leistung',
};

const ageLabels = {
  U7: 'spielerisch, kurz und mit vielen Ballkontakten',
  U9: 'spielerisch mit klaren Mini-Aufgaben',
  U11: 'technisch strukturiert mit ersten Entscheidungen',
  U13: 'spielnah, technisch sauber und entscheidungsorientiert',
  U15: 'taktischer, intensiver und gruppenbezogen',
  U17: 'wettkampfnah mit Tempo, Druck und klaren Auslösern',
};

function getDurations(totalMinutes) {
  const safeTotal = Math.max(30, totalMinutes);
  const weights = [0.16, 0.24, 0.25, 0.25, 0.1];
  const durations = weights.map((weight) => Math.max(5, Math.round(safeTotal * weight)));
  let difference = safeTotal - durations.reduce((sum, value) => sum + value, 0);
  const adjustmentOrder = [2, 3, 1, 0, 4];

  while (difference !== 0) {
    for (const index of adjustmentOrder) {
      if (difference === 0) break;
      if (difference > 0) {
        durations[index] += 1;
        difference -= 1;
      } else if (durations[index] > 5) {
        durations[index] -= 1;
        difference += 1;
      }
    }
  }

  return durations;
}

function getPlayerOrganisation(count) {
  const players = parseInt(count, 10) || 10;

  if (players <= 8) {
    return {
      label: 'Kleine Gruppe',
      setup: `${players} Spieler: kleines Feld, viele Wiederholungen, kurze Wege. Nach jeder Aktion rotieren.`,
      shortSetup: '1 Feld / 2-3 Teams / schnelle Rotation',
      fieldCount: '1 Feld',
      format: '2 gegen 2 / 3 gegen 3',
    };
  }

  if (players <= 14) {
    return {
      label: 'Zwei Gruppen',
      setup: `${players} Spieler: zwei Gruppen parallel. Rotationsspieler einplanen, damit Wartezeiten kurz bleiben.`,
      shortSetup: '2 Felder / 2 Gruppen / Rotationsspieler',
      fieldCount: '2 Felder',
      format: '4 gegen 4 / 5 gegen 5',
    };
  }

  return {
    label: 'Viele Spieler',
    setup: `${players} Spieler: zwei bis drei Felder parallel. Gruppen fest einteilen und Stationen klar rotieren lassen.`,
    shortSetup: '2-3 Felder / 3 Gruppen / Wartezeiten vermeiden',
    fieldCount: '2-3 Felder',
    format: 'Stationen / parallele Spielformen',
  };
}

function normalizeWords(value) {
  return value
    .toLowerCase()
    .replace(/[ä]/g, 'ae')
    .replace(/[ö]/g, 'oe')
    .replace(/[ü]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function materialScore(exerciseMaterial, userMaterial) {
  const userWords = normalizeWords(userMaterial);
  if (!userWords.length) return 0;
  return exerciseMaterial.reduce((score, item) => {
    const itemWords = normalizeWords(item);
    return score + (itemWords.some((word) => userWords.some((userWord) => userWord.includes(word) || word.includes(userWord))) ? 1 : 0);
  }, 0);
}

function scoreExercise(exercise, { age, focus, level, players, material, phase }) {
  let score = 0;

  if (exercise.phase === phase) score += 20;
  if (exercise.focus === focus) score += 18;
  if (exercise.ageGroups.includes(age)) score += 14;
  if (exercise.levels.includes(level)) score += 8;
  if (players >= exercise.minPlayers && players <= exercise.maxPlayers) {
    score += 12;
  } else {
    const distance = players < exercise.minPlayers ? exercise.minPlayers - players : players - exercise.maxPlayers;
    score -= distance * 2;
  }
  score += Math.min(6, materialScore(exercise.material, material));
  if (phase === 'activation' && exercise.intensity === 'low') score += 2;
  if ((phase === 'gameform' || phase === 'finalgame') && exercise.intensity === 'high') score += 2;

  return score;
}

function pickExercise({ phase, focus, age, level, players, material, seed, usedIds }) {
  const exact = trainingLibrary.filter((exercise) => exercise.phase === phase && exercise.focus === focus && !usedIds.has(exercise.id));
  const candidates = exact.length
    ? exact
    : trainingLibrary.filter((exercise) => exercise.phase === phase && !usedIds.has(exercise.id));

  const ranked = candidates
    .map((exercise) => ({
      exercise,
      score: scoreExercise(exercise, { age, focus, level, players, material, phase }),
    }))
    .sort((a, b) => b.score - a.score || a.exercise.title.localeCompare(b.exercise.title));

  const pool = ranked.slice(0, Math.min(5, ranked.length));
  return pool[(seed + phaseOrder.indexOf(phase)) % pool.length]?.exercise ?? ranked[0]?.exercise;
}

function adaptOrganisation(baseOrganisation, players, playerOrganisation) {
  if (players <= 8) {
    return `${baseOrganisation} ${playerOrganisation.fieldCount}, kurze Wege, viele Wiederholungen.`;
  }

  if (players <= 14) {
    return `${baseOrganisation} ${playerOrganisation.fieldCount}, Gruppen rotieren nach 2-3 Minuten.`;
  }

  return `${baseOrganisation} ${playerOrganisation.fieldCount}, parallele Stationen aufbauen und Wartezeiten vermeiden.`;
}

function adaptDuration(targetDuration, durationRange) {
  const [min, max] = durationRange;
  return Math.min(max, Math.max(min, targetDuration));
}

function createTrainingPlan(form, seed = 0) {
  const { alter, dauer, schwerpunkt, spieleranzahl, niveau, material } = form;
  const totalMinutes = parseInt(dauer, 10) || 90;
  const players = parseInt(spieleranzahl, 10) || 10;
  const focus = focusMap[schwerpunkt] || 'passspiel';
  const level = levelMap[niveau] || 'einsteiger';
  const materialText = material?.trim() || 'Bälle, Hütchen, Markierungsteller';
  const playerOrganisation = getPlayerOrganisation(players);
  const targetDurations = getDurations(totalMinutes);
  const usedIds = new Set();

  const abschnitte = phaseOrder.map((phase, index) => {
    const exercise = pickExercise({
      phase,
      focus,
      age: alter,
      level,
      players,
      material: materialText,
      seed,
      usedIds,
    });
    usedIds.add(exercise.id);

    return {
      id: exercise.id,
      phase: phaseLabels[index],
      dauer: adaptDuration(targetDurations[index], exercise.durationRange),
      exerciseName: exercise.title,
      ziel: exercise.goal,
      organisation: adaptOrganisation(exercise.organization, players, playerOrganisation),
      coachingPoints: exercise.coachingPoints.slice(0, 3),
      ablauf: exercise.setupHint,
      varianten: exercise.variants,
      material: exercise.material.join(', '),
      intensity: exercise.intensity,
    };
  });

  const durationDifference = totalMinutes - abschnitte.reduce((sum, section) => sum + section.dauer, 0);
  if (durationDifference !== 0) {
    const mainIndex = durationDifference > 0 ? 3 : abschnitte.findIndex((section) => section.dauer > 6);
    if (mainIndex >= 0) {
      abschnitte[mainIndex] = {
        ...abschnitte[mainIndex],
        dauer: Math.max(5, abschnitte[mainIndex].dauer + durationDifference),
      };
    }
  }

  return {
    abschnitte,
    trainerNote: `${ageLabels[alter] || ageLabels.U11}. ${playerOrganisation.shortSetup}. Fokus: ${schwerpunkt} sichtbar machen, wenig erklären, viel spielen lassen.`,
    meta: {
      alter,
      totalMinutes,
      schwerpunkt,
      spieleranzahl,
      niveau,
      material: materialText,
      ageLabel: ageLabels[alter] || ageLabels.U11,
      organisation: playerOrganisation.label,
      fieldCount: playerOrganisation.fieldCount,
      format: playerOrganisation.format,
      shortSetup: playerOrganisation.shortSetup,
      libraryCount: libraryStats.exerciseCount,
    },
  };
}

export default function App() {
  const [plan, setPlan] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);
  const [seed, setSeed] = useState(0);

  const handleGenerate = (formData) => {
    const nextSeed = 0;
    setLastFormData(formData);
    setSeed(nextSeed);
    setPlan(createTrainingPlan(formData, nextSeed));
  };

  const handleRegenerate = () => {
    if (!lastFormData) return;
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    setPlan(createTrainingPlan(lastFormData, nextSeed));
  };

  return (
    <div className="app-shell">
      <header className="app-header no-print">
        <div className="product-title">
          <p className="app-name">Session Planner</p>
          <h1>Fußball Trainingsplaner</h1>
          <p>Trainingspläne für Jugendtrainer in wenigen Minuten.</p>
        </div>
        <div className="top-meta" aria-label="Produktinformationen">
          <span>{libraryStats.exerciseCount} Übungen</span>
          <span>Lokal im Browser</span>
          <span>Kein Login</span>
          <span>PDF-fähig</span>
        </div>
        <svg className="tactic-doodle" viewBox="0 0 180 92" aria-hidden="true">
          <rect x="6" y="6" width="168" height="80" rx="8" />
          <line x1="90" y1="6" x2="90" y2="86" />
          <circle cx="90" cy="46" r="17" />
          <circle className="marker marker-a" cx="38" cy="26" r="6" />
          <circle className="marker marker-a" cx="55" cy="62" r="6" />
          <circle className="marker marker-b" cx="130" cy="32" r="6" />
          <circle className="marker marker-b" cx="144" cy="64" r="6" />
          <path className="run-line" d="M43 27 C63 14, 82 20, 104 35" />
          <path className="pass-line" d="M58 62 C82 54, 103 45, 126 34" />
          <path className="arrow-head" d="M104 35 l-9 -1 l5 8" />
        </svg>
      </header>

      <main className="layout">
        <TrainingForm onGenerate={handleGenerate} />
        {plan ? (
          <TrainingPlan plan={plan} onRegenerate={handleRegenerate} />
        ) : (
          <section className="empty-plan" aria-label="Start ohne Trainingsplan">
            <div className="empty-map" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="section-kicker">Session Board</span>
            <h2>Noch keine Einheit erstellt.</h2>
            <p>Session Setup ausfüllen oder Preset wählen. Der Trainingsplan erscheint hier als strukturiertes Coaching Board.</p>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <small>Läuft lokal im Browser. Kein Login, keine KI-Kosten, keine Datenspeicherung.</small>
      </footer>
    </div>
  );
}
