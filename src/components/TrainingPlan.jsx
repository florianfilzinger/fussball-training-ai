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
    `${index + 1}. ${section.dauer} Min - ${section.exerciseName}\n` +
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
    <section className="plan-section printable-plan">
      <div className="plan-topbar">
        <div>
          <span className="section-kicker">Session-Flow</span>
          <h2>Dein Trainingsplan</h2>
          <p>{plan.meta.ageLabel}</p>
        </div>
        <div className="plan-actions no-print">
          <button type="button" className="secondary-button" onClick={onRegenerate}>Beispiel variieren</button>
          <button type="button" className="secondary-button" onClick={handleCopy}>
            {copyState === 'copied' ? 'Text kopiert' : 'Plan als Text kopieren'}
          </button>
          <button type="button" className="secondary-button print-button" onClick={handlePrint}>Drucken / PDF</button>
        </div>
      </div>

      {copyState === 'error' ? <p className="copy-error no-print">Kopieren ist hier nicht verfügbar.</p> : null}

      <div className="session-preview">
        <span><strong>{plan.meta.alter}</strong> Altersklasse</span>
        <span><strong>{plan.meta.schwerpunkt}</strong> Schwerpunkt</span>
        <span><strong>{plan.meta.totalMinutes} min</strong> Dauer</span>
        <span><strong>{plan.meta.fieldCount}</strong> Organisation</span>
      </div>

      <div className="timeline">
        {plan.abschnitte.map((section, index) => (
          <article key={`${section.phase}-${section.exerciseName}`} className="timeline-item">
            <div className="timeline-marker">
              <span>{index + 1}</span>
            </div>

            <div className="timeline-card">
              <header className="timeline-header">
                <div>
                  <span className="phase-label">{section.phase}</span>
                  <h3>{section.exerciseName}</h3>
                </div>
                <span className="duration-badge">{section.dauer} min</span>
              </header>

              <div className="quick-grid">
                <div>
                  <span className="micro-label">Ziel</span>
                  <p>{section.ziel}</p>
                </div>
                <div>
                  <span className="micro-label">Organisation</span>
                  <p>{section.organisation}</p>
                </div>
              </div>

              <div className="coaching-box">
                <span className="micro-label">Coachings</span>
                <ul>
                  {section.coachingPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="material-line">
                <span>Material</span>
                <p>{section.material}</p>
              </div>

              <details className="detail-panel">
                <summary>Ablauf, Varianten und Trainerhinweis</summary>
                <div className="detail-grid">
                  <div>
                    <strong>Ablauf</strong>
                    <p>{section.ablauf}</p>
                  </div>
                  <div>
                    <strong>Varianten</strong>
                    <ul>
                      {(Array.isArray(section.varianten) ? section.varianten : [section.varianten]).map((variant) => (
                        <li key={variant}>{variant}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            </div>
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
