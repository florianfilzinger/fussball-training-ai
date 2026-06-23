import React, { useState } from 'react';

const presets = [
  {
    label: 'U9 Dribbling',
    values: {
      alter: 'U9',
      dauer: '75',
      schwerpunkt: 'Dribbling',
      spieleranzahl: '10',
      niveau: 'Einsteiger',
      material: 'Bälle, Hütchen, Markierungsteller, 4 Minitore',
    },
  },
  {
    label: 'U11 Passspiel',
    values: {
      alter: 'U11',
      dauer: '90',
      schwerpunkt: 'Passspiel',
      spieleranzahl: '14',
      niveau: 'Fortgeschritten',
      material: 'Bälle, Hütchen, Leibchen, 4 Minitore',
    },
  },
  {
    label: 'U13 Umschalten',
    values: {
      alter: 'U13',
      dauer: '90',
      schwerpunkt: 'Umschalten',
      spieleranzahl: '18',
      niveau: 'Fortgeschritten',
      material: 'Bälle, Hütchen, Leibchen, 2 Großtore, 4 Minitore',
    },
  },
];

const defaultValues = {
  alter: 'U9',
  dauer: '90',
  schwerpunkt: 'Passspiel',
  spieleranzahl: '10',
  niveau: 'Einsteiger',
  material: 'Bälle, Hütchen, Markierungsteller',
};

export default function TrainingForm({ onGenerate }) {
  const [form, setForm] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function applyPreset(values) {
    setForm(values);
    setErrors({});
    onGenerate(values);
  }

  function validate() {
    const nextErrors = {};

    if ((parseInt(form.dauer, 10) || 0) < 30) {
      nextErrors.dauer = 'Mindestens 30 Minuten.';
    }

    if ((parseInt(form.spieleranzahl, 10) || 0) < 4) {
      nextErrors.spieleranzahl = 'Mindestens 4 Spieler.';
    }

    if (!form.material.trim()) {
      nextErrors.material = 'Bitte Material eintragen.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    onGenerate({ ...form, material: form.material.trim() });
  }

  return (
    <section className="builder-card no-print">
      <div className="builder-head">
        <div>
          <span className="section-kicker">Builder</span>
          <h2>Einheit vorbereiten</h2>
        </div>
        <div className="preset-row" aria-label="Schnell-Presets">
          {presets.map((preset) => (
            <button key={preset.label} type="button" className="preset-button" onClick={() => applyPreset(preset.values)}>
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="training-form" noValidate>
        <div className="form-grid top-fields">
          <label className="form-group" htmlFor="alter">
            <span>Alter</span>
            <select id="alter" value={form.alter} onChange={(event) => updateField('alter', event.target.value)}>
              <option value="U7">U7</option>
              <option value="U9">U9</option>
              <option value="U11">U11</option>
              <option value="U13">U13</option>
              <option value="U15">U15</option>
              <option value="U17">U17</option>
            </select>
          </label>

          <label className="form-group" htmlFor="schwerpunkt">
            <span>Ziel</span>
            <select id="schwerpunkt" value={form.schwerpunkt} onChange={(event) => updateField('schwerpunkt', event.target.value)}>
              <option value="Passspiel">Passspiel</option>
              <option value="Dribbling">Dribbling</option>
              <option value="Torabschluss">Torabschluss</option>
              <option value="Umschalten">Umschalten</option>
              <option value="Koordination">Koordination</option>
            </select>
          </label>

          <label className="form-group" htmlFor="niveau">
            <span>Niveau</span>
            <select id="niveau" value={form.niveau} onChange={(event) => updateField('niveau', event.target.value)}>
              <option value="Einsteiger">Einsteiger</option>
              <option value="Fortgeschritten">Fortgeschritten</option>
              <option value="Leistung">Leistung</option>
            </select>
          </label>
        </div>

        <div className="form-grid bottom-fields">
          <label className="form-group" htmlFor="spieleranzahl">
            <span>Spieler</span>
            <input
              type="number"
              id="spieleranzahl"
              min="4"
              max="24"
              value={form.spieleranzahl}
              onChange={(event) => updateField('spieleranzahl', event.target.value)}
              aria-invalid={Boolean(errors.spieleranzahl)}
            />
            {errors.spieleranzahl ? <small className="form-error">{errors.spieleranzahl}</small> : null}
          </label>

          <label className="form-group" htmlFor="dauer">
            <span>Minuten</span>
            <input
              type="number"
              id="dauer"
              min="30"
              step="5"
              value={form.dauer}
              onChange={(event) => updateField('dauer', event.target.value)}
              aria-invalid={Boolean(errors.dauer)}
            />
            {errors.dauer ? <small className="form-error">{errors.dauer}</small> : null}
          </label>

          <label className="form-group material-field" htmlFor="material">
            <span>Material</span>
            <input
              type="text"
              id="material"
              value={form.material}
              onChange={(event) => updateField('material', event.target.value)}
              aria-invalid={Boolean(errors.material)}
            />
            {errors.material ? <small className="form-error">{errors.material}</small> : null}
          </label>
        </div>

        <button type="submit" className="submit-button">Training erstellen</button>
      </form>
    </section>
  );
}
