import React, { useState } from 'react';
import TrainingForm from './components/TrainingForm.jsx';
import TrainingPlan from './components/TrainingPlan.jsx';

const ageProfiles = {
  U7: {
    label: 'spielerisch, kurz und mit vielen Ballkontakten',
    mode: 'playful',
    coachingTone: ['Kurz vormachen', 'Alle Kinder mit Ball', 'Wenig erklären'],
    fieldHint: 'kleines Feld, viele Tore, einfache Regeln',
    gameFormat: '3 gegen 3 auf vier Hütchentore',
  },
  U9: {
    label: 'spielerisch mit klaren Mini-Aufgaben',
    mode: 'playful',
    coachingTone: ['Viele Ballkontakte', 'Mutige Aktionen loben', 'Schnell wieder spielen'],
    fieldHint: 'zwei kleine Felder oder ein Dribbelgarten mit vielen Zielen',
    gameFormat: '4 gegen 4 mit Bonuspunkt für Schwerpunktaktion',
  },
  U11: {
    label: 'technisch strukturiert mit ersten Entscheidungen',
    mode: 'technical',
    coachingTone: ['Saubere Technik', 'Erster Blick nach vorne', 'Entscheidung abfragen'],
    fieldHint: 'zwei Gruppen parallel, klare Rotationen, kurze Wartezeiten',
    gameFormat: '5 gegen 5 mit Zielzonen oder Minitoren',
  },
  U13: {
    label: 'spielnah, technisch sauber und entscheidungsorientiert',
    mode: 'technical',
    coachingTone: ['Vororientierung', 'Aktion unter Gegnerdruck', 'Nach Aktion sofort anbieten'],
    fieldHint: 'zwei Felder mit Rotationsspieler oder Joker',
    gameFormat: '6 gegen 6 mit Joker und Schwerpunktregel',
  },
  U15: {
    label: 'taktischer, intensiver und gruppenbezogen',
    mode: 'tactical',
    coachingTone: ['Tempo hochhalten', 'Abstände coachen', 'Trigger klar benennen'],
    fieldHint: 'kompaktes Spielfeld mit Zonen, Gegnerdruck und klaren Rollen',
    gameFormat: '7 gegen 7 mit Umschalt- oder Zielzonenregel',
  },
  U17: {
    label: 'wettkampfnah mit Tempo, Druck und klaren Auslösern',
    mode: 'tactical',
    coachingTone: ['Höchstes Tempo', 'Restverteidigung sichern', 'Gruppentaktik konkret korrigieren'],
    fieldHint: 'positionsnahes Feld, hohe Intensität, kurze Coachingstopps',
    gameFormat: '8 gegen 8 oder 9 gegen 9 mit klarer Spielphase',
  },
};

const focusLibrary = {
  Passspiel: {
    warmup: {
      playful: 'Pass-Jagd durch Hütchentore',
      technical: 'Passdreieck mit Auftaktbewegung',
      tactical: 'Rondo-Aktivierung mit Spiel über den Dritten',
    },
    technique: {
      playful: 'Hütchentor-Passen mit Farbkommando',
      technical: 'Passdreieck mit Klatsch und Tiefenlauf',
      tactical: 'Positionsrondo 4 plus 2 gegen 2',
    },
    game: {
      playful: '4-Tore-Spiel mit Passbonus',
      technical: '5 gegen 5 über den Dritten',
      tactical: '7 gegen 7 mit Vertikalpass-Regel',
    },
    points: ['Passfuß fest machen', 'Erster Kontakt in Spielrichtung', 'Freilaufen nach dem Pass', 'Freien Spieler früh erkennen', 'Pass scharf in den richtigen Fuß'],
    goals: ['Passqualität sichern', 'Ersten Kontakt verbessern', 'Freilaufen und Anschlussaktion verbinden'],
    variants: ['Maximal zwei Kontakte', 'Bonuspunkt nach Direktspiel', 'Feld enger machen', 'Joker als Wandspieler nutzen'],
  },
  Dribbling: {
    warmup: {
      playful: 'Farb-Reaktionsspiel mit Ball',
      technical: 'Dribbelgarten mit Richtungswechsel',
      tactical: '1-gegen-1-Aktivierung aus seitlichem Start',
    },
    technique: {
      playful: 'Hütchentore-Dribbling',
      technical: 'Finte und Tempo durch zwei Tore',
      tactical: '1 gegen 1 mit Anschlussaktion',
    },
    game: {
      playful: 'Dribbelkönig auf vier Tore',
      technical: '3 gegen 3 mit Dribbelzone',
      tactical: '5 gegen 5 mit Andribbel-Trigger',
    },
    points: ['Ball eng am Fuß', 'Kopf nach vorne heben', 'Richtungswechsel explosiv', 'Finte vor dem Gegner', 'Nach dem Gegner Tempo aufnehmen'],
    goals: ['Enge Ballführung verbessern', 'Mutige 1-gegen-1-Aktionen fördern', 'Nach der Finte beschleunigen'],
    variants: ['Nur schwacher Fuß', 'Zeitlimit pro Aktion', 'Verteidiger startet näher', 'Bonuspunkt für klare Finte'],
  },
  Torabschluss: {
    warmup: {
      playful: 'Zielschuss-Challenge nach Dribbling',
      technical: 'Torschuss nach erstem Kontakt',
      tactical: 'Abschluss-Aktivierung nach Tiefenlauf',
    },
    technique: {
      playful: 'Schusskorridor mit Zielecken',
      technical: 'Torabschluss nach Doppelpass',
      tactical: 'Abschluss unter Gegnerdruck',
    },
    game: {
      playful: '4 gegen 4 mit Abschlusszone',
      technical: '3 gegen 2 auf Torabschluss',
      tactical: '6 gegen 6 mit Abschlussfenster',
    },
    points: ['Vor dem Schuss Ziel wählen', 'Erster Kontakt Richtung Tor', 'Standbein neben den Ball', 'Nachsetzen', 'Timing vor Tempo'],
    goals: ['Schusstechnik stabilisieren', 'Abschluss nach Voraktion trainieren', 'Schnell unter Druck abschließen'],
    variants: ['Direktabschluss', 'Nur nach Doppelpass', 'Nachschuss zählt doppelt', 'Abschlusszone verkleinern'],
  },
  Umschalten: {
    warmup: {
      playful: 'Farbwechsel-Fangspiel mit Ball',
      technical: 'Ballgewinn-Sprint auf Minitor',
      tactical: 'Gegenpressing-Aktivierung 4 gegen 2',
    },
    technique: {
      playful: '3 gegen 2 nach Ballklau',
      technical: '4 gegen 3 Umschalten auf Minitore',
      tactical: 'Umschaltspiel 5 gegen 5',
    },
    game: {
      playful: '4 gegen 4 mit Ballgewinn-Bonus',
      technical: '5 gegen 5 mit 6-Sekunden-Regel',
      tactical: '7 gegen 7 mit Umschaltregel',
    },
    points: ['Erster Blick nach vorne', 'Nach Ballverlust sofort Druck auf den Ball', 'Erster Pass nach Ballgewinn', 'Schnell nachrücken', 'Ballnah attackieren'],
    goals: ['Ballgewinn schnell nutzen', 'Nach Ballverlust direkt reagieren', 'Gemeinsam nachrücken'],
    variants: ['6-Sekunden-Regel', 'Kontertore zählen doppelt', 'Umschaltzone markieren', 'Ballverlust erzeugt Sofortdruck'],
  },
  Koordination: {
    warmup: {
      playful: 'Koordinations-Memory mit Ball',
      technical: 'Leiter, Ballmitnahme und Pass',
      tactical: 'Reaktionsparcours mit Anschlussentscheidung',
    },
    technique: {
      playful: 'Insel-Parcours mit Ballaufgaben',
      technical: 'Koordinationsparcours mit Zielpass',
      tactical: 'Reaktionslauf mit Spielverlagerung',
    },
    game: {
      playful: 'Bewegungsduell auf Hütchentore',
      technical: '3 gegen 3 mit Reaktionsstart',
      tactical: '5 gegen 5 mit Signalwechsel',
    },
    points: ['Schnelle Füße', 'Rhythmus halten', 'Nach Bewegung Ball kontrollieren', 'Körper tief beim Richtungswechsel', 'Auf Signal sofort reagieren'],
    goals: ['Laufkoordination verbessern', 'Ballkoordination verbinden', 'Reaktion und Beweglichkeit trainieren'],
    variants: ['Farbsignal wechseln', 'Parcours spiegeln', 'Partneraufgabe', 'Technikbonus vergeben'],
  },
};

const phaseLabels = ['Aktivierung', 'Technik', 'Spielform', 'Abschlussspiel', 'Abschluss'];

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

function getPlayerOrganisation(count, ageProfile) {
  const players = parseInt(count, 10) || 10;

  if (players <= 8) {
    return {
      label: 'Kleine Gruppe',
      setup: `${players} Spieler: ein kleines Feld, viele Wiederholungen, kurze Wege. Nutze 2 gegen 2 oder 3 gegen 3 und rotiere nach jeder Aktion.`,
      shortSetup: '1 Feld / 2-3 Teams / schnelle Rotation',
      fieldCount: '1 Feld',
      format: ageProfile.mode === 'playful' ? '2 gegen 2 / 3 gegen 3' : '3 gegen 3 plus Joker',
    };
  }

  if (players <= 14) {
    return {
      label: 'Zwei Gruppen',
      setup: `${players} Spieler: zwei Gruppen parallel aufbauen. Rotationsspieler einplanen, damit jeder nach kurzer Pause wieder aktiv ist.`,
      shortSetup: '2 Felder / 2 Gruppen / Rotationsspieler',
      fieldCount: '2 Felder',
      format: ageProfile.mode === 'tactical' ? '5 gegen 5 plus Joker' : '4 gegen 4 / 5 gegen 5',
    };
  }

  return {
    label: 'Viele Spieler',
    setup: `${players} Spieler: zwei bis drei Felder parallel. Gruppen fest einteilen, klare Rotationen ansagen und Wartezeiten vermeiden.`,
    shortSetup: '2-3 Felder / 3 Gruppen / Wartezeiten vermeiden',
    fieldCount: '2-3 Felder',
    format: ageProfile.mode === 'tactical' ? '7 gegen 7 plus Rotationen' : 'Stationstraining und 5 gegen 5',
  };
}

function getExerciseName(focus, ageProfile, slot, niveau) {
  const focusData = focusLibrary[focus] || focusLibrary.Passspiel;
  const mode = niveau === 'Leistung' && ageProfile.mode !== 'playful' ? 'tactical' : ageProfile.mode;
  const names = slot === 'warmup' ? focusData.warmup : slot === 'technique' ? focusData.technique : focusData.game;
  return names[mode] || names.technical;
}

function takeCoachingPoints(focus, ageProfile, niveau, offset = 0) {
  const focusData = focusLibrary[focus] || focusLibrary.Passspiel;
  const base = [...focusData.points, ...ageProfile.coachingTone];
  const amount = 3;
  return base.slice(offset).concat(base.slice(0, offset)).slice(0, amount);
}

function getSectionTarget(focus, index) {
  const focusData = focusLibrary[focus] || focusLibrary.Passspiel;
  if (index === 0) return `Körper aktivieren und erste ${focus.toLowerCase()}-Aktionen sammeln`;
  if (index === 1) return focusData.goals[0];
  if (index === 2) return focusData.goals[1];
  if (index === 3) return focusData.goals[2];
  return 'Belastung senken und wichtigsten Lernpunkt sichern';
}

function getSectionOrganisation(index, form, ageProfile, playerOrganisation) {
  const focus = form.schwerpunkt;

  if (index === 0) {
    return `${playerOrganisation.fieldCount}. Jeder Spieler mit Ball, kleine Felder, sofort starten.`;
  }

  if (index === 1) {
    return `${playerOrganisation.shortSetup}. Technikaktion nach 45-60 Sekunden rotieren.`;
  }

  if (index === 2) {
    return `${playerOrganisation.format}. Schwerpunktregel: ${focus} vor Torabschluss oder Punktgewinn.`;
  }

  if (index === 3) {
    return `${ageProfile.gameFormat}. Klare Rotation, kurze Coachingstopps.`;
  }

  return 'Alle Spieler mit Ball. Kurz auslaufen, Lernpunkt nennen, positiv beenden.';
}

function getSectionFlow(index, form, ageProfile) {
  const focus = form.schwerpunkt.toLowerCase();
  const flows = [
    `Freie Ballbewegung, dann Signalaufgaben. Nach 3 Minuten eine einfache ${focus}-Regel ergänzen.`,
    'Vormachen, 2 Minuten frei üben lassen, dann kurze Korrektur und Tempo erhöhen.',
    'Aktion startet immer mit Ball vom Trainer oder Startspieler. Nach Abschluss sofort Rollen wechseln.',
    'Freies Spiel mit einer klaren Bonusregel. Nur kurz stoppen, wenn der Schwerpunkt nicht sichtbar wird.',
    'Locker bewegen, Bälle einsammeln, ein positives Beispiel aus der Einheit nennen.',
  ];

  if (ageProfile.mode === 'playful') return flows[index].replace('Korrektur', 'Mini-Aufgabe');
  if (ageProfile.mode === 'tactical') return flows[index].replace('Bonusregel', 'taktischen Trigger');
  return flows[index];
}

function getTrainerNote(schwerpunkt, ageProfile, playerOrganisation) {
  const focusNotes = {
    Passspiel: 'Passqualität, ersten Kontakt und Freilaufwinkel sichtbar machen.',
    Dribbling: 'Mut im 1 gegen 1 belohnen und nach der Finte Tempo fordern.',
    Torabschluss: 'Klare Zielwahl, sauberen ersten Kontakt und konsequentes Nachsetzen coachen.',
    Umschalten: 'Die erste Reaktion nach Ballgewinn oder Ballverlust sofort einfordern.',
    Koordination: 'Saubere Bewegungsqualität vor Geschwindigkeit setzen.',
  };

  return `${ageProfile.label}. ${playerOrganisation.shortSetup}. Fokus: ${focusNotes[schwerpunkt] || 'eine klare Schwerpunktaktion sichtbar machen'}`;
}

function createTrainingPlan(form, variant = 0) {
  const { alter, dauer, schwerpunkt, spieleranzahl, niveau, material } = form;
  const totalMinutes = parseInt(dauer, 10) || 90;
  const durations = getDurations(totalMinutes);
  const ageProfile = ageProfiles[alter] || ageProfiles.U11;
  const focusData = focusLibrary[schwerpunkt] || focusLibrary.Passspiel;
  const playerOrganisation = getPlayerOrganisation(spieleranzahl, ageProfile);
  const materialText = material?.trim() || 'Bälle, Hütchen, Markierungsteller';
  const gameName = variant % 2 === 0
    ? getExerciseName(schwerpunkt, ageProfile, 'game', niveau)
    : `${getExerciseName(schwerpunkt, ageProfile, 'game', niveau)} mit Bonusregel`;

  const exerciseNames = [
    getExerciseName(schwerpunkt, ageProfile, 'warmup', niveau),
    getExerciseName(schwerpunkt, ageProfile, 'technique', niveau),
    ageProfile.mode === 'playful' ? focusData.technique.playful : focusData.game.technical,
    gameName,
    'Team-Challenge und Lernpunkt sichern',
  ];

  return {
    abschnitte: phaseLabels.map((phase, index) => ({
      phase,
      dauer: durations[index],
      exerciseName: exerciseNames[index],
      ziel: getSectionTarget(schwerpunkt, index),
      organisation: getSectionOrganisation(index, { ...form, material: materialText }, ageProfile, playerOrganisation),
      coachingPoints: takeCoachingPoints(schwerpunkt, ageProfile, niveau, index),
      ablauf: getSectionFlow(index, { ...form, material: materialText }, ageProfile),
      varianten: index === 4
        ? 'Penalty-Challenge, Spieler wählen Lieblingsaktion oder kurze Technikaufgabe für zuhause.'
        : focusData.variants.slice(0, 3 + (niveau === 'Leistung' ? 1 : 0)),
      material: materialText,
    })),
    trainerNote: getTrainerNote(schwerpunkt, ageProfile, playerOrganisation),
    meta: {
      alter,
      totalMinutes,
      schwerpunkt,
      spieleranzahl,
      niveau,
      material: materialText,
      ageLabel: ageProfile.label,
      organisation: playerOrganisation.label,
      fieldCount: playerOrganisation.fieldCount,
      format: playerOrganisation.format,
      shortSetup: playerOrganisation.shortSetup,
    },
  };
}

export default function App() {
  const [plan, setPlan] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);
  const [variant, setVariant] = useState(0);

  const handleGenerate = (formData) => {
    const nextVariant = 0;
    setLastFormData(formData);
    setVariant(nextVariant);
    setPlan(createTrainingPlan(formData, nextVariant));
  };

  const handleRegenerate = () => {
    if (!lastFormData) return;
    const nextVariant = variant + 1;
    setVariant(nextVariant);
    setPlan(createTrainingPlan(lastFormData, nextVariant));
  };

  return (
    <div className="app-shell">
      <header className="app-header no-print">
        <div>
          <p className="app-name">Fußball Training AI</p>
          <h1>Trainingsplan in 30 Sekunden</h1>
        </div>
        <p className="trust-line">Ohne Login · lokal im Browser · direkt nutzbar</p>
      </header>

      <main className="layout">
        <TrainingForm onGenerate={handleGenerate} />
        {plan ? (
          <TrainingPlan plan={plan} onRegenerate={handleRegenerate} />
        ) : (
          <section className="empty-plan" aria-label="Start ohne Trainingsplan">
            <span className="section-kicker">Trainingszettel</span>
            <h2>Noch kein Plan.</h2>
            <p>Preset wählen oder Werte setzen. Danach steht hier der kompakte Ablauf für den Platz.</p>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <small>Läuft lokal im Browser. Kein Login, kein Backend, keine Datenspeicherung.</small>
      </footer>
    </div>
  );
}
