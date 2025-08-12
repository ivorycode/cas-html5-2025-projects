# InfraImprover

## Projekt Eingabe



Idee ist cool. Der Scope der App müsste noch irgendwie "abgerundet" werden ... warum werden die Probleme erfasst?

Tip: Denkt an die Demo der Abschlusspräsentation: Demo idealerweise als "Rollenspiel"  -> Fokussiert euch dann auf die Feaures die dazu nötig sind, und nur auf diese ... 



Fragen:

- Wer ist der Empfänger der erfassten Probleme? => Gemeinde/Stadt



Scope: 

- Passt basierend auf dem aktuellen Detaillierungs-Grad
  - Je nach dem wie detailliert/komplex ihr die Erfassung macht, könnten wohl auch "Optionale-Punkte" umgesetzt werden



Main Features:

- Erfassen von Infrastruktur Problemen
- Priorisieren der Probleme
- Auswertung



Begeisterungsfaktoren:

- Map Integration
- Foto Upload



Eher weglassen im Scope der Semesterarbeit:

- Möglichst kein Login/Userverwaltung umsetzen ...  gegebenfalls mocken (z.B. für die Demo "hart-codierte" User vorbereiten)



Gedanken:

- Ionic fände ich sehr spannend, aber ich könnte mir vorstellen, dass doch etliche Reibungsverluste entstehen könnten, wenn ihr nicht schon Erfahrung damit habt ... -> bald Entscheiden ob ihr das wollt oder ob ihr den einfacheren Weg eines Responsive Designs gehen wollt

  - es wären dann wohl auch zwei Apps: Erfassung - Auswertung

- Backend: es braucht ein Backend, es handelt sich ja um eine verteilte Applikation und die Kommunikation ist ein essentieller Teil des Frontends

  - Im Backend: möglichst viel mocken, einfach halten

  - Schaut euch eine "Backend as a Service" Platform an:
    - Convex
    - Supabase
    - Firebase
    - Cloudflare: D1 Database, Pages, Workers
    - ....
  - Macht möglichst bald Experimente / einen POC für das Backend, auch wenn ihr euch z.B. noch nicht für das Frontend-Framewört entschieden habt

- Macht möglist bald einen POC für den Foto upload und die Map Integration

- Desktop vs. Mobile: Entscheidet euch früh was ihr unterstützen wollt (ev. pro Screen). Deklariert das klar und fokussiert dann von Beginn nur auf das was ihr unterstützen wollt ...





Mögliche zusätzliche Begeisterungsfaktoren:

- Offline Fähigkeit beim erfassen



## Projekt Spezifikation

### Umfeld, Ausgangslage / Aufgabenstellung & Ziel

Klarer ausgearbeitet als noch in der Eingabe. ✅



### Scope:

Passt. 

Abgerundeter Scope mit einigen (aber lösbaren) Herausfoderungen. Geplante Features gehen über eine simple CRUD Anwendung hinaus ✅

- Kommentare könnten auch genutzt werden für ein Feedback von der "Staatsstelle" => z.B. "Baustelle geplant für Sommmer 2026"
- Suche / Filterung ist mir noch nicht ganz klar ... => Wireframes



### Architektur / Design

Passt.

- Techstack ist nicht trivial, aber dabei lernt ihr viel. 
  Dokumentiert auch eure "Learnings" im Abschlussbericht ... villeicht würdet ihr etwas anders machen wenn ihr genügend Zeit hättet -> dokumentieren.

- Hosting des Frontends? Supabase unterstützt soweit ich gesehen habe kein Frontend Deployment ...
- Diagram: Kommunikation - mit Supabase.js würde ich nicht mehr von "REST" sprechen ... das ist doch eher RPC?
- Sieht so aus als hättet ihr bereits experimentiert / prototypen gemacht: ✅
  - Supabase RPC Function
  - Supabase Storage
- Datenbank: Bewertungen sollten wohl auch abgebildet sein.
- Upload von Fotos direkt von Kamera -> Prototype ... da gab es in der Vergangenheit auch Probleme ...
- Design des Routing habt ihr noch nicht gemacht ... würde ich raten bald zu machen ... mit Abgleich zu den Wireframes



### Wireframes:

Passt. Flow bereits sehr schön ausgearbeitet.