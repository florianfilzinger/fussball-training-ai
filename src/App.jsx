import React, { useState } from 'react';
import TrainingForm from './components/TrainingForm.jsx';
import TrainingPlan from './components/TrainingPlan.jsx';

const focusTemplates = {
  Passspiel: {
    simple: {
      ziel: 'Pass zum Mitspieler bringen und den ersten Kontakt in Spielrichtung mitnehmen',
      ablauf: 'Dreiecke mit Hütchen aufbauen. Spieler passen, nehmen den Ball seitlich mit und laufen dem Pass nach. Nach drei Pässen geht der Ball durch ein Hütchentor.',
      coaching: 'Vor dem Pass kurz hochschauen. Standbein zeigt zum Ziel. Erster Kontakt raus aus den Füßen und in den freien Raum.',
      varianten: 'Abstand verkürzen. Schwachen Fuß einbauen. Nach dem Pass sofort neuen Winkel anbieten.',
    },
    advanced: {
      ziel: 'Passwinkel, Vororientierung und Anschlussaktion unter Druck verbessern',
      ablauf: '4 gegen 2 im Rechteck. Nach sechs Pässen darf ein Zieltor angespielt werden. Ballgewinn: Verteidiger kontern auf zwei Minitoren.',
      coaching: 'Schulterblick vor der Annahme. Offene Stellung zum Feld. Pass scharf in den richtigen Fuß. Nach dem Abspiel sofort freilaufen.',
      varianten: 'Zwei Kontakte. Joker an einer Seitenlinie. Feld enger machen. Zieltor nur nach Klatschball öffnen.',
    },
  },
  Dribbling: {
    simple: {
      ziel: 'Ball eng führen, Richtungen wechseln und mutig ins freie Tor dribbeln',
      ablauf: 'Dribbelgarten mit vielen Hütchentoren. Jeder Spieler hat einen Ball und sammelt Tore. Nach jedem Tor Richtung und Tempo wechseln.',
      coaching: 'Ball nah am Fuß. Viele kleine Kontakte. Kopf nach jedem zweiten Kontakt heben. Nach der Finte sofort beschleunigen.',
      varianten: 'Nur linker oder rechter Fuß. Farbsignal für nächstes Tor. Partner als Schattenläufer.',
    },
    advanced: {
      ziel: '1 gegen 1 gezielt lösen und danach schnell abschließen oder passen',
      ablauf: 'Angreifer startet seitlich, Verteidiger frontal. Ziel sind zwei Minitoren. Nach dem Duell kommt sofort der nächste Ball.',
      coaching: 'Mit Tempo andribbeln. Finte vor dem Abstand zum Gegner. Körper zwischen Ball und Gegner bringen. Nach dem Vorbeigehen Tempo aufnehmen.',
      varianten: 'Zeitlimit setzen. Verteidiger näher starten lassen. Bonuspunkt für klar erkennbare Finte.',
    },
  },
  Torabschluss: {
    simple: {
      ziel: 'Aus kurzer Distanz sauber aufs Tor abschließen',
      ablauf: 'Pass vom Trainer oder Mitspieler. Erster Kontakt in Schussrichtung. Abschluss auf markierte Ecken. Danach Ball holen und Position wechseln.',
      coaching: 'Standbein neben den Ball. Fußspitze zum Ziel. Oberkörper leicht über den Ball. Vor dem Schuss kurz Ziel wählen.',
      varianten: 'Links und rechts im Wechsel. Abschluss nach kurzem Dribbling. Zielecken mit Zusatzpunkten.',
    },
    advanced: {
      ziel: 'Nach Voraktion unter Druck schnell und präzise abschließen',
      ablauf: 'Pass auf Wandspieler, Tiefenlauf, Ballmitnahme und Abschluss. Ein Verteidiger setzt nach und erzwingt Tempo.',
      coaching: 'Laufweg vor dem Pass starten. Erster Kontakt Richtung Tor. Torwart kurz wahrnehmen. Nachschuss aktiv suchen.',
      varianten: 'Direktabschluss. Abschlusszone begrenzen. Zweiten Ball für Rebound einspielen.',
    },
  },
  Umschalten: {
    simple: {
      ziel: 'Nach Ballgewinn schnell nach vorne spielen und nach Ballverlust sofort stören',
      ablauf: '3 gegen 3 mit zwei Zielspielern. Nach Ballgewinn muss in fünf Sekunden ein Zielspieler angespielt werden.',
      coaching: 'Erster Blick nach vorne. Ballnah sofort Druck machen. Neben dem Ball kurze Passwege schließen.',
      varianten: 'Zeit auf acht Sekunden erhöhen. Zielspieler als Joker nutzen. Feld kleiner machen.',
    },
    advanced: {
      ziel: 'Ballgewinn und Ballverlust als Team sofort erkennen und nutzen',
      ablauf: '4 gegen 4 auf vier Tore. Ein Tor zählt doppelt nach Vertikalpass oder schnellem Dribbling in die Tiefe.',
      coaching: 'Ballnah attackieren. Ballfern absichern. Erster Pass nach Ballgewinn nach vorne. Restverteidigung aktiv halten.',
      varianten: 'Acht-Sekunden-Regel. Umschaltzone markieren. Kurzzeitige Unterzahl nach Ballverlust.',
    },
  },
  Koordination: {
    simple: {
      ziel: 'Fußarbeit, Gleichgewicht und Ballgefühl verbessern',
      ablauf: 'Parcours mit Leiter, Hütchen und Ballstation. Nach jeder Laufaufgabe folgt ein Pass, eine Ballmitnahme oder ein kurzes Dribbling.',
      coaching: 'Leise und schnelle Füße. Knie leicht beugen. Nach der Bewegung den Ball mit dem ersten Kontakt kontrollieren.',
      varianten: 'Parcours spiegeln. Partneraufgaben. Verschiedene Farben als Startsignal.',
    },
    advanced: {
      ziel: 'Koordination mit Ballmitnahme, Pass und Anschlussaktion verbinden',
      ablauf: 'Leiter, Richtungswechsel, Ballmitnahme und Pass in ein Zieltor. Zwei Gruppen arbeiten parallel mit kurzen Wartezeiten.',
      coaching: 'Explosiver erster Schritt. Körper tief beim Richtungswechsel. Nach Belastung trotzdem sauber passen.',
      varianten: 'Reaktionssignal. Gegnerdruck nach der Leiter. Technikbonus im Wettbewerb.',
    },
  },
};

const ageProfiles = {
  U7: {
    label: 'spielerisch und kurz',
    mode: 'playful',
    hint: 'kurz vormachen, schnell spielen lassen, wenig warten lassen',
    mainFormat: '1 gegen 1, 2 gegen 1 oder kleine Stationen mit einem klaren Ziel',
    game: '3 gegen 3 oder 4 gegen 4 mit vielen Ballaktionen',
    intensity: 'kurze Belastungen, viele Pausen mit Ball und einfache Sprache',
  },
  U9: {
    label: 'spielerisch mit einfachen Regeln',
    mode: 'playful',
    hint: 'klare Bilder nutzen, Aufgaben kurz halten, viele Erfolgserlebnisse schaffen',
    mainFormat: '2 gegen 1, 3 gegen 2 oder kleine Wettbewerbe mit einfachen Punkten',
    game: '4 gegen 4 mit Hütchentoren und Zusatzpunkten für mutige Aktionen',
    intensity: 'spielerisch steigern und Wartezeiten konsequent kurz halten',
  },
  U11: {
    label: 'technisch strukturiert mit ersten Entscheidungen',
    mode: 'technical',
    hint: 'Technik vormachen, sauber wiederholen und dann ins Duell bringen',
    mainFormat: 'Technikstation plus 2 gegen 1 oder 3 gegen 2 mit klarer Anschlussaktion',
    game: '5 gegen 5 mit Zielzonen und klarer Schwerpunktregel',
    intensity: 'gleichmäßiger Übungsrhythmus mit kurzen Coachingstopps',
  },
  U13: {
    label: 'technisch strukturiert und spielnah',
    mode: 'technical',
    hint: 'spielnah üben, Entscheidungen abfragen und Technik gezielt korrigieren',
    mainFormat: '3 gegen 2, 4 gegen 3 oder Rondos mit Anschluss in Zielzonen',
    game: '6 gegen 6 mit Joker oder Zielzonen',
    intensity: 'saubere Technik unter moderatem Gegnerdruck einfordern',
  },
  U15: {
    label: 'spielnah und taktisch klar',
    mode: 'tactical',
    hint: 'Positionen einbeziehen, intensiv spielen lassen, kurz und klar coachen',
    mainFormat: '4 gegen 4 plus Joker, Zonenspiel oder gruppentaktische Spielform',
    game: '7 gegen 7 auf kompaktem Feld mit taktischer Zusatzregel',
    intensity: 'intensive Spielphasen mit aktiver Restverteidigung und klarer Rollenverteilung',
  },
  U17: {
    label: 'intensiv und wettkampfnah',
    mode: 'tactical',
    hint: 'hohes Tempo fordern, kurz korrigieren, echte Spielsituationen nutzen',
    mainFormat: 'positionsbezogene Spielform mit Umschaltmomenten und Zeitdruck',
    game: '8 gegen 8 oder 9 gegen 9 mit Spielphasen und Umschaltaufgaben',
    intensity: 'wettkampfnahes Tempo, klare taktische Trigger und kurze präzise Korrekturen',
  },
};

const sectionNames = ['Aufwärmen', 'Hauptteil 1', 'Hauptteil 2', 'Spielform', 'Abschluss'];

function splitPlayers(count) {
  const players = parseInt(count, 10) || 8;
  const teamA = Math.max(2, Math.floor(players / 2));
  const teamB = Math.max(2, players - teamA);
  return `${teamA} gegen ${teamB}`;
}

function getDurations(totalMinutes) {
  const safeTotal = Math.max(30, totalMinutes);
  const weights = [0.18, 0.25, 0.25, 0.22, 0.1];
  const durations = weights.map((weight) => Math.max(5, Math.round(safeTotal * weight)));
  let difference = safeTotal - durations.reduce((sum, value) => sum + value, 0);
  const adjustmentOrder = [1, 2, 3, 0, 4];

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

function getTemplateForAge(focus, ageProfile) {
  if (ageProfile.mode === 'tactical') return focus.advanced;

  if (ageProfile.mode === 'technical') {
    return {
      ...focus.simple,
      ziel: `${focus.simple.ziel} und als feste Technikaktion sicher wiederholen`,
      ablauf: `${focus.simple.ablauf} Danach folgt eine Anschlussaktion mit Gegner oder Zielzone.`,
      coaching: `${focus.simple.coaching} Erst sauber, dann schneller. Gegnerdruck Schritt für Schritt erhöhen.`,
      varianten: `${focus.simple.varianten} Am Ende in eine kleine Spielform übertragen.`,
    };
  }

  return {
    ...focus.simple,
    ziel: `${focus.simple.ziel} mit vielen Ballkontakten und einfachen Erfolgserlebnissen`,
    ablauf: `${focus.simple.ablauf} Kurz erklären, vormachen und direkt spielen lassen.`,
    coaching: `${focus.simple.coaching} Nur ein bis zwei Coachingpunkte gleichzeitig nutzen.`,
    varianten: `${focus.simple.varianten} Regeln vereinfachen, wenn die Aktion stockt.`,
  };
}

function getTrainerNote(schwerpunkt, ageProfile) {
  const focusNotes = {
    Passspiel: 'saubere offene Stellung und mutige Anschlussaktion nach dem Pass',
    Dribbling: 'Kopf hoch, mutige Richtungswechsel und Beschleunigung nach der Finte',
    Torabschluss: 'ruhige Vorbereitung, klare Zielentscheidung und Nachsetzen nach dem Schuss',
    Umschalten: 'sofortige Reaktion nach Ballgewinn oder Ballverlust',
    Koordination: 'saubere Bewegungsqualität vor hohem Tempo',
  };

  const ageNotes = {
    playful: 'Heute zählt: viel Bewegung, viele Ballkontakte, kurze Erklärungen.',
    technical: 'Heute zählt: saubere Technik, dann Anwendung unter leichtem Druck.',
    tactical: 'Heute zählt: klare Auslöser erkennen und mit Tempo handeln.',
  };

  return `${ageNotes[ageProfile.mode]} Mein Hauptfokus: ${focusNotes[schwerpunkt] || 'eine klare Schwerpunktaktion sichtbar machen'}.`;
}

function createTrainingPlan(form, variant = 0) {
  const { alter, dauer, schwerpunkt, spieleranzahl, niveau, material } = form;
  const totalMinutes = parseInt(dauer, 10) || 90;
  const durations = getDurations(totalMinutes);
  const ageProfile = ageProfiles[alter] || ageProfiles.U11;
  const focus = focusTemplates[schwerpunkt] || focusTemplates.Passspiel;
  const template = getTemplateForAge(focus, ageProfile);
  const teamSplit = splitPlayers(spieleranzahl);
  const materialText = material?.trim() || 'Bälle, Hütchen, Markierungsteller';
  const variantSuffix = variant % 2 === 0
    ? 'Starte mit niedriger Intensität und steigere die Anforderungen sichtbar.'
    : 'Beginne mit freier Bewegung und führe die Schwerpunktregel erst nach zwei Minuten ein.';

  const plan = {
    abschnitte: sectionNames.map((name, index) => ({
      name,
      dauer: durations[index],
      material: materialText,
      ...[
      {
        ziel: `Körper und Kopf auf ${schwerpunkt.toLowerCase()} vorbereiten`,
        ablauf: `Alle Spieler mit Ball im Feld. Dribbeln, passen, Richtung wechseln. Danach ein kurzes Reaktionsspiel passend für ${alter}. ${variantSuffix}`,
        coaching: `${ageProfile.hint}. Auf aktive Körperhaltung und viele Ballaktionen achten.`,
        varianten: 'Farbsignal, Partneraufgabe, Zusatzpunkt für schwachen Fuß oder kleine Fangform.',
      },
      {
        ...template,
        ablauf: `${template.ablauf} Für ca. ${spieleranzahl || 8} Spieler in zwei Gruppen aufbauen, damit kaum Wartezeit entsteht.`,
        coaching: `${template.coaching} Niveau: ${niveau}.`,
      },
      {
        ziel: `${template.ziel} in einer spielnahen Entscheidungssituation anwenden`,
        ablauf: `${ageProfile.mainFormat} mit klarer Schwerpunktregel. Nach erfolgreicher Aktion sofort Richtung Zieltor weiterspielen.`,
        coaching: `${template.coaching} Kurz stoppen, eine Lösung zeigen, sofort weiterspielen.`,
        varianten: `${template.varianten} Gegnerdruck, Feldgröße und Kontaktzahl passend zum Team anpassen.`,
      },
      {
        ziel: `Den Schwerpunkt ${schwerpunkt.toLowerCase()} im freien Spiel sichtbar machen`,
        ablauf: `${ageProfile.game}. Bei ${teamSplit} zählt ein Treffer doppelt, wenn vorher der Schwerpunkt klar zu sehen war.`,
        coaching: 'Wenig unterbrechen. Gute Aktionen sofort loben. Nach kurzen Pausen eine konkrete Frage stellen: Was war die beste Lösung?',
        varianten: 'Bonusregel ändern, Joker einsetzen, Tore breiter stellen, Feld enger machen oder kurze Turnierform spielen.',
      },
      {
        ziel: 'Belastung senken, Lernerfolg sichern und Training positiv beenden',
        ablauf: 'Locker mit Ball auslaufen. Danach eine kurze Frage in die Runde: Was hat heute beim Schwerpunkt gut funktioniert?',
        coaching: 'Ein positives Detail nennen. Eine einfache Ballaufgabe für zuhause mitgeben.',
        varianten: 'Penalty-Challenge, ruhige Technikaufgabe oder Spieler wählen die beste Übung des Tages.',
      },
    ][index],
    })),
    trainerNote: getTrainerNote(schwerpunkt, ageProfile),
    meta: {
      alter,
      totalMinutes,
      schwerpunkt,
      spieleranzahl,
      niveau,
      material: materialText,
      ageLabel: ageProfile.label,
    },
  };

  return plan;
}

export default function App() {
  const [plan, setPlan] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);
  const [variant, setVariant] = useState(0);

  const handleGenerate = (formData) => {
    const nextVariant = 0;
    const newPlan = createTrainingPlan(formData, nextVariant);
    setLastFormData(formData);
    setVariant(nextVariant);
    setPlan(newPlan);
  };

  const handleRegenerate = () => {
    if (!lastFormData) return;
    const nextVariant = variant + 1;
    setVariant(nextVariant);
    setPlan(createTrainingPlan(lastFormData, nextVariant));
  };

  return (
    <div className="container">
      <header className="app-header">
        <span className="eyebrow">Für Jugendtrainer</span>
        <h1>Fußball Training AI</h1>
        <p className="subtitle">
          Erstelle schnell einen passenden Trainingsplan für dein Team.
        </p>
      </header>
      <main>
        <TrainingForm onGenerate={handleGenerate} />
        {plan && <TrainingPlan plan={plan} onRegenerate={handleRegenerate} />}
      </main>
      <footer>
        <small>
          Läuft lokal im Browser. Es werden keine Daten gespeichert.
        </small>
      </footer>
    </div>
  );
}
