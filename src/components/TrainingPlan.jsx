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
    <section className="training-sheet printable-plan">
      <div className="sheet-toolbar no-print">
        <div className="plan-actions no-print">
          <button type="button" className="secondary-button" onClick={onRegenerate}>Beispiel variieren</button>
          <button type="button" className="secondary-button" onClick={handleCopy}>
            {copyState === 'copied' ? 'Text kopiert' : 'Plan als Text kopieren'}
          </button>
          <button type="button" className="secondary-button print-button" onClick={handlePrint}>Drucken / PDF</button>
        </div>
      </div>

      {copyState === 'error' ? <p className="copy-error no-print">Kopieren ist hier nicht verfügbar.</p> : null}

      <header className="sheet-header">
        <span className="section-kicker">Trainingszettel</span>
        <h2>{plan.meta.alter} · {plan.meta.schwerpunkt} · {plan.meta.totalMinutes} Minuten · {plan.meta.spieleranzahl} Spieler</h2>
        <p><strong>Organisation:</strong> {plan.meta.shortSetup}</p>
      </header>

      <div className="flow-strip" aria-label="Ablauf">
        {plan.abschnitte.map((section) => (
          <span key={`${section.phase}-${section.dauer}`}>
            <strong>{section.dauer}'</strong> {section.phase}
          </span>
        ))}
      </div>

      <div className="sheet-sections">
        {plan.abschnitte.map((section, index) => (
          <article key={`${section.phase}-${section.exerciseName}`} className="sheet-card">
            <header className="sheet-card-head">
              <div className="phase-stack">
                <span className="duration-badge">{section.dauer}'</span>
                <span className="phase-label">{section.phase}</span>
              </div>
              <div>
                <p className="sheet-index">{index + 1}</p>
                <h3>{section.exerciseName}</h3>
              </div>
            </header>

            <div className="sheet-card-body">
              <p><strong>Ziel:</strong> {section.ziel}</p>
              <p><strong>Organisation:</strong> {section.organisation}</p>
              <ul className="coach-list">
                {section.coachingPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="material-line"><strong>Material:</strong> {section.material}</p>
            </div>

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
        <span className="section-kicker">Trainer-Notiz</span>
        <h3>Worauf achte ich heute?</h3>
        <p>{plan.trainerNote}</p>
      </aside>
    </section>
  );
}
