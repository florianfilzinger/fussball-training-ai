import React, { useState } from 'react';

function listToText(items) {
  return Array.isArray(items) ? items.map((item) => `- ${item}`).join('\n') : `- ${items}`;
}

function formatPlanAsText(plan) {
  const meta = [
    `Altersklasse: ${plan.meta.alter}`,
    `Dauer: ${plan.meta.totalMinutes} Minuten`,
    `Schwerpunkt: ${plan.meta.schwerpunkt}`,
    `Spieleranzahl: ${plan.meta.spieleranzahl}`,
    `Niveau: ${plan.meta.niveau}`,
    `Organisation: ${plan.meta.fieldCount}, ${plan.meta.format}`,
    `Material: ${plan.meta.material}`,
  ].join('\n');

  const sections = plan.abschnitte.map((section, index) => (
    `${index + 1}. ${section.dauer}' - ${section.exerciseName}\n` +
    `Phase: ${section.phase}\n` +
    `Ziel: ${section.ziel}\n` +
    `Organisation: ${section.organisation}\n` +
    `Coachingpunkte:\n${listToText(section.coachingPoints)}\n` +
    `Varianten:\n${listToText(section.varianten)}\n` +
    `Material: ${section.material}`
  ));

  return (
    `Fußball Training AI - Trainingsplan\n\n${meta}\n\n${sections.join('\n\n')}` +
    `\n\nTrainer-Notiz\n${plan.trainerNote}`
  );
}

export default function TrainingPlan({ plan, onRegenerate }) {
  const [copyState, setCopyState] = useState('idle');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatPlanAsText(plan));
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('error');
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <section className="session-board printable-plan">
      <div className="board-toolbar no-print">
        <div className="board-title">
          <span className="section-kicker">Session Board</span>
          <h2>Trainingsplan</h2>
        </div>
        <div className="plan-actions">
          <button type="button" className="secondary-button" onClick={onRegenerate}>Beispiel variieren</button>
          <button type="button" className="secondary-button" onClick={handleCopy}>
            {copyState === 'copied' ? 'Text kopiert' : 'Plan als Text kopieren'}
          </button>
          <button type="button" className="secondary-button print-button" onClick={handlePrint}>Drucken / PDF</button>
        </div>
      </div>

      {copyState === 'error' ? <p className="copy-error no-print">Kopieren ist hier nicht verfügbar.</p> : null}

      <header className="session-summary">
        <div className="summary-main">
          <span className="section-kicker">Session Summary</span>
          <h2>{plan.meta.alter} {plan.meta.schwerpunkt}</h2>
          <p>{plan.meta.ageLabel}</p>
          <p className="summary-organisation">{plan.meta.shortSetup}</p>
        </div>
        <div className="summary-stats" aria-label="Trainingsdaten">
          <span><strong>{plan.meta.totalMinutes}</strong> Minuten</span>
          <span><strong>{plan.meta.spieleranzahl}</strong> Spieler</span>
          <span><strong>{plan.meta.niveau}</strong> Niveau</span>
          <span><strong>{plan.meta.libraryCount}</strong> Übungen</span>
        </div>
        <div className="summary-map" aria-hidden="true">
          <svg className="mini-pitch" viewBox="0 0 220 132">
            <rect x="8" y="8" width="204" height="116" rx="8" />
            <line x1="110" y1="8" x2="110" y2="124" />
            <circle cx="110" cy="66" r="24" />
            <rect x="8" y="42" width="32" height="48" />
            <rect x="180" y="42" width="32" height="48" />
            <circle className="marker marker-a" cx="58" cy="38" r="7" />
            <circle className="marker marker-a" cx="76" cy="82" r="7" />
            <circle className="marker marker-a" cx="116" cy="58" r="7" />
            <circle className="marker marker-b" cx="154" cy="42" r="7" />
            <circle className="marker marker-b" cx="166" cy="88" r="7" />
            <path className="pass-line" d="M61 39 C84 48, 96 53, 112 58" />
            <path className="run-line" d="M118 58 C138 52, 148 47, 154 42" />
            <path className="arrow-head" d="M154 42 l-10 -2 l5 9" />
          </svg>
        </div>
      </header>

      <div className="phase-strip" aria-label="Ablauf">
        {plan.abschnitte.map((section) => (
          <span key={`${section.phase}-${section.dauer}`}>
            <strong>{section.dauer}'</strong> {section.phase}
          </span>
        ))}
      </div>

      <div className="session-cards">
        {plan.abschnitte.map((section, index) => (
          <article key={`${section.phase}-${section.exerciseName}`} className="session-card">
            <header className="session-card-head">
              <div className="phase-index">
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="exercise-title">
                <span className="phase-label">{section.phase}</span>
                <h3>{section.exerciseName}</h3>
              </div>
              <span className="duration-badge">{section.dauer}'</span>
            </header>

            <div className="card-core">
              <div>
                <span>Ziel</span>
                <p>{section.ziel}</p>
              </div>
              <div>
                <span>Organisation</span>
                <p>{section.organisation}</p>
              </div>
            </div>

            <div className="coaching-panel">
              <span>Coachingpunkte</span>
              <ul>
                {section.coachingPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <p className="material-line"><strong>Material</strong>{section.material}</p>

            <details className="detail-panel">
              <summary>Ablauf & Varianten</summary>
              <p>{section.ablauf}</p>
              <ul>
                {(Array.isArray(section.varianten) ? section.varianten : [section.varianten]).map((variant) => (
                  <li key={variant}>{variant}</li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </div>

      <aside className="trainer-note">
        <span className="section-kicker">Trainer Note</span>
        <h3>Worauf achte ich heute?</h3>
        <p>{plan.trainerNote}</p>
      </aside>
    </section>
  );
}
