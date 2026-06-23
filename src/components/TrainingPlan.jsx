import React, { useState } from 'react';

function formatPlanAsText(plan) {
  const meta = [
    `Altersklasse: ${plan.meta.alter}`,
    `Dauer: ${plan.meta.totalMinutes} Minuten`,
    `Schwerpunkt: ${plan.meta.schwerpunkt}`,
    `Spieleranzahl: ${plan.meta.spieleranzahl}`,
    `Niveau: ${plan.meta.niveau}`,
    `Material: ${plan.meta.material}`,
  ].join('\n');

  const sections = plan.abschnitte.map((abschnitt, index) => (
    `${index + 1}. ${abschnitt.name} (${abschnitt.dauer} Minuten)\n` +
    `Ziel: ${abschnitt.ziel}\n` +
    `Ablauf: ${abschnitt.ablauf}\n` +
    `Coachingpunkte: ${abschnitt.coaching}\n` +
    `Varianten: ${abschnitt.varianten}\n` +
    `Material: ${abschnitt.material}`
  ));

  return (
    `Fußball Training AI - Trainingsplan\n\n${meta}\n\n${sections.join('\n\n')}` +
    `\n\nTrainer-Notiz\nWorauf achte ich heute besonders?\n${plan.trainerNote}`
  );
}

/**
 * Präsentiert den generierten Trainingsplan in einer übersichtlichen Form.
 * Jeder Abschnitt wird mit den wichtigsten Informationen dargestellt. Für
 * größere Bildschirme werden Dauer und Abschnittsnamen hervorgehoben;
 * auf kleinen Bildschirmen ordnen sich die Karten automatisch untereinander an.
 */
export default function TrainingPlan({ plan, onRegenerate }) {
  const [copyState, setCopyState] = useState('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatPlanAsText(plan));
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="plan-section">
      <div className="plan-topbar">
        <div className="section-heading">
          <span className="section-kicker">Schritt 2</span>
          <h2>Dein Trainingsplan</h2>
          <p>{plan.meta.ageLabel} · {plan.meta.schwerpunkt} · {plan.meta.totalMinutes} Minuten</p>
        </div>
        <div className="plan-actions">
          <button type="button" className="secondary-button" onClick={onRegenerate}>
            Neuen Beispielplan erstellen
          </button>
          <button type="button" className="secondary-button" onClick={handleCopy}>
            {copyState === 'copied' ? 'Text kopiert' : 'Plan als Text kopieren'}
          </button>
          <button type="button" className="secondary-button print-button" onClick={handlePrint}>
            Drucken / PDF speichern
          </button>
        </div>
      </div>

      {copyState === 'error' && (
        <p className="copy-error">Kopieren ist hier nicht verfügbar.</p>
      )}

      <div className="plan-meta" aria-label="Trainingsdaten">
        <span><strong>Altersklasse</strong>{plan.meta.alter}</span>
        <span><strong>Dauer</strong>{plan.meta.totalMinutes} min</span>
        <span><strong>Spieler</strong>{plan.meta.spieleranzahl}</span>
        <span><strong>Niveau</strong>{plan.meta.niveau}</span>
      </div>

      <div className="plan-cards">
        {plan.abschnitte.map((abschnitt, index) => (
          <article key={abschnitt.name} className="plan-card">
            <header className="plan-card-header">
              <div>
                <span className="step-number">{index + 1}</span>
                <h3>{abschnitt.name}</h3>
              </div>
              <span className="duration">{abschnitt.dauer} min</span>
            </header>
            <div className="plan-card-content">
              <div>
                <strong>Ziel</strong>
                <p>{abschnitt.ziel}</p>
              </div>
              <div>
                <strong>Ablauf</strong>
                <p>{abschnitt.ablauf}</p>
              </div>
              <div>
                <strong>Coachingpunkte</strong>
                <p>{abschnitt.coaching}</p>
              </div>
              <div>
                <strong>Varianten</strong>
                <p>{abschnitt.varianten}</p>
              </div>
              <div>
                <strong>Material</strong>
                <p>{abschnitt.material || 'Keine Angabe'}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="trainer-note">
        <span className="section-kicker">Trainer-Notiz</span>
        <h3>Worauf achte ich heute besonders?</h3>
        <p>{plan.trainerNote}</p>
      </aside>
    </section>
  );
}
