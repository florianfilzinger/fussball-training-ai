# Fußball Training AI

Fußball Training AI ist ein lokaler Trainingsplaner für Jugendfußballtrainer. Die Demo erstellt aus wenigen Eingaben einen praxisnahen Trainingszettel für Teams von U7 bis U17.

Die App läuft vollständig im Browser: kein Backend, kein Login, keine Datenbank, keine externe KI und keine Datenspeicherung.

## v2: Lokale Übungsbibliothek

Die Trainingspläne werden regelbasiert aus einer lokalen Übungsbibliothek erzeugt. Dadurch entstehen keine KI-Kosten und keine API-Abhängigkeit.

- 40 strukturierte Trainingsübungen
- 5 Schwerpunkte: Passspiel, Dribbling, Torabschluss, Umschalten, Koordination
- Auswahl nach Altersklasse, Niveau, Spieleranzahl, Trainingsdauer und Material
- Variation über lokale Seed-Logik statt externer KI

## Features

- Trainingsplan in wenigen Klicks erstellen
- Schnell-Presets für U9 Dribbling, U11 Passspiel und U13 Umschalten
- Lokale Übungsbibliothek mit echten Trainingsbausteinen
- Altersklassenlogik für U7/U9, U11/U13 und U15/U17
- Schwerpunktlogik für Passspiel, Dribbling, Torabschluss, Umschalten und Koordination
- Spieleranzahl beeinflusst Organisation, Feldanzahl und Rotationen
- Trainingszettel mit Dauer, Übungsname, Ziel, Organisation, Coachingpunkten und Material
- Aufklappbare Details für Ablauf und Varianten
- Plan als Text kopieren für WhatsApp, Notizen oder Mail
- Drucken oder als PDF über die Browser-Druckfunktion speichern
- Mobile-first Oberfläche für Trainer am Platz

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Die App läuft lokal meist unter:

```text
http://localhost:5173/
```

## Build

```bash
npm run build
```

## Datenschutz-Hinweis

Diese Demo speichert keine Trainingsdaten. Alle Eingaben bleiben lokal im Browserzustand und werden nicht an einen Server übertragen.
