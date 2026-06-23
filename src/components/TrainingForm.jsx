import React, { useState } from 'react';

/**
 * Das Formular sammelt die Daten für den Trainingsplan. Es besteht aus
 * Dropdowns und Texteingaben, sodass Trainer mit wenigen Klicks ihre
 * Parameter wählen können. Beim Absenden wird der Zustand nach oben
 * gereicht, wo der Trainingsplan generiert wird.
 */
export default function TrainingForm({ onGenerate }) {
  const [alter, setAlter] = useState('U9');
  const [dauer, setDauer] = useState('90');
  const [schwerpunkt, setSchwerpunkt] = useState('Passspiel');
  const [spieleranzahl, setSpieleranzahl] = useState('8');
  const [niveau, setNiveau] = useState('Einsteiger');
  const [material, setMaterial] = useState('Bälle, Hütchen, Markierungsteller');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if ((parseInt(dauer, 10) || 0) < 30) {
      nextErrors.dauer = 'Die Trainingsdauer muss mindestens 30 Minuten betragen.';
    }

    if ((parseInt(spieleranzahl, 10) || 0) < 4) {
      nextErrors.spieleranzahl = 'Die Spieleranzahl muss mindestens 4 betragen.';
    }

    if (!material.trim()) {
      nextErrors.material = 'Bitte gib mindestens ein verfügbares Material an.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onGenerate({
      alter,
      dauer,
      schwerpunkt,
      spieleranzahl,
      niveau,
      material: material.trim(),
    });
  };

  return (
    <section className="form-section">
      <div className="section-heading">
        <span className="section-kicker">Schritt 1</span>
        <h2>Training planen</h2>
        <p>Wähle Team, Zeit, Schwerpunkt und Material.</p>
      </div>
      <form onSubmit={handleSubmit} className="training-form" noValidate>
        <fieldset>
          <legend>Team</legend>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="alter">Altersklasse</label>
              <select
                id="alter"
                value={alter}
                onChange={(e) => setAlter(e.target.value)}
              >
                <option value="U7">U7</option>
                <option value="U9">U9</option>
                <option value="U11">U11</option>
                <option value="U13">U13</option>
                <option value="U15">U15</option>
                <option value="U17">U17</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dauer">Trainingsdauer</label>
              <input
                type="number"
                id="dauer"
                min="30"
                step="5"
                value={dauer}
                onChange={(e) => {
                  setDauer(e.target.value);
                  setErrors((current) => ({ ...current, dauer: undefined }));
                }}
                aria-invalid={Boolean(errors.dauer)}
                aria-describedby={errors.dauer ? 'dauer-error' : undefined}
              />
              <small>Minuten, mindestens 30</small>
              {errors.dauer && (
                <p className="form-error" id="dauer-error">{errors.dauer}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="spieleranzahl">Spieleranzahl</label>
              <input
                type="number"
                id="spieleranzahl"
                min="4"
                max="24"
                value={spieleranzahl}
                onChange={(e) => {
                  setSpieleranzahl(e.target.value);
                  setErrors((current) => ({ ...current, spieleranzahl: undefined }));
                }}
                aria-invalid={Boolean(errors.spieleranzahl)}
                aria-describedby={errors.spieleranzahl ? 'spieleranzahl-error' : undefined}
              />
              {errors.spieleranzahl && (
                <p className="form-error" id="spieleranzahl-error">{errors.spieleranzahl}</p>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Inhalt</legend>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="schwerpunkt">Schwerpunkt</label>
              <select
                id="schwerpunkt"
                value={schwerpunkt}
                onChange={(e) => setSchwerpunkt(e.target.value)}
              >
                <option value="Passspiel">Passspiel</option>
                <option value="Dribbling">Dribbling</option>
                <option value="Torabschluss">Torabschluss</option>
                <option value="Umschalten">Umschalten</option>
                <option value="Koordination">Koordination</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="niveau">Leistungsniveau</label>
              <select
                id="niveau"
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
              >
                <option value="Einsteiger">Einsteiger</option>
                <option value="Fortgeschritten">Fortgeschritten</option>
                <option value="Leistung">Leistung</option>
              </select>
            </div>
            <div className="form-group form-group-wide">
              <label htmlFor="material">Verfügbare Materialien</label>
              <input
                type="text"
                id="material"
                value={material}
                onChange={(e) => {
                  setMaterial(e.target.value);
                  setErrors((current) => ({ ...current, material: undefined }));
                }}
                aria-invalid={Boolean(errors.material)}
                aria-describedby={errors.material ? 'material-error' : undefined}
              />
              {errors.material && (
                <p className="form-error" id="material-error">{errors.material}</p>
              )}
            </div>
          </div>
        </fieldset>
        <button type="submit" className="submit-button">Trainingsplan erstellen</button>
      </form>
    </section>
  );
}
