# FridgeBuddy



Coole Idee für ein Projekt.



Scope: 

Ich denke die eine oder andere Ausbaustufe sollte drin liegen 

- gibt aber sofort einen Brocken Zusatzaufwand und Komplexität

- -> beginnt früh mit der Entscheidung und macht einen POC mit den Technologien

  

Main Features:

- Lebesmittel erfassen
- Lebensmittel anzeigen
- Lebensmittel reservieren



Begeisterungsfaktoren:

- Foto Upload
- => eher wenig, in ohne Ausbaustufen :-)



Eher weglassen im Scope der Semesterarbeit:

- Nicht zu viel Detailinformationen (Klassifizieung: Lebensmittelart, Essgewohnheit ...) ... allerdings für zusätzliche Begeisterungsfaktoren ev. nötig 
- Möglicht kein Login/Userverwaltung umsetzen-> gegebenfalls mocken (z.B. für die Demo "hart-codierte" User vorbereitn)







Mögliche zusätzliche Begeisterungsfaktoren

- Map Integration: Standort erfassen (automatisch?), Anzeige auf Map
- Subscribe und Push für Abholer: 
  - Mit Klassifizierung: "Ich möchte notifiziert werden, wenn vegane Lebensmittel abzugeben sind ..."
  - Mit Angabe von Geolocation: "abholbar im Bereich 2 km um Bern" -> wahrscheinlich noch einiges komplexer
- Gamification: cool
- Gemini: wäre cool aber mir noch nicht klar was der use-case ist
- Lebensmittel mittels Kartenintegration suchen: verstehe ich nicht ganz
- Zusätzlich werden Essensgewohnheiten und der Standort berücksichtigt.





Gedanken:

- Die Features sind relativ "atomar" und daher recht simpel: erfassen/anzeigen
  - Komplexität kommt vielleicht beim Anzeigen dazu: Map, Filtering ....
  - Mit der Reservation kommt ein Workflow dazu, der das ganze Spannend macht
- Tip: Denkt an die Abschlusspräsentation: Demo idealerweise als "Rollenspiel" 
  - Was braucht es dazu damit das cool wird -> Fokus
- Entscheidet euch möglichst bald für die Prio der Ausbaustufen und macht einen POC dafür
- Backend: es braucht ein Backend, es handelt sich ja um eine verteilte Applikation und die Kommunikation ist ein essentieller Teil des Frontends
  - Im Backend: möglichst viel mocken, einfach halten
  - Schaut euch eine "Backend as a Service" Platform an:
    - Convex
    - Supabase
    - Firebase
    - Cloudflare: D1 Database, Pages, Workers
    - ....
  - Macht möglichst bald Experimente / einen POC für das Backend, auch wenn ihr euch z.B. noch nicht für das Frontend-Framewört entschieden habt
- Macht möglist bald einen POC für den Foto upload
- Desktop vs. Mobile: Entscheidet euch früh was ihr unterstützen wollt. Deklariert das klar und fokussiert dann von Beginn nur auf das was ihr unterstützen wollt ...











# FunOrganizer



Die Projektbeschreibung scheint mir noch sehr generisch/abstrakt und noch nicht so konkret ... ich denke da sollte ihr möglichst bald konkreter werden und "Szenarios" skizzieren welche mit der App realisiert werden sollen.
Tip: Denkt an die Demo der Abschlusspräsentation: Demo idealerweise als "Rollenspiel"  -> Fokussiert euch dann auf die Feaures die dazu nötig sind, und nur auf diese ...





Scope: 

- Schwierig zu sagen, da die "Variationen der Abstimmungen" noch nicht konkret sind



Main Features:

- Abstimmung erfassen
- Abstimmung durchführen
- Ergebnis anzeigen



Begeisterungsfaktoren:

- Noch zu abstrakt um das wirklich zu sagen :-)
  - Push
  - Workflow? -> Vorschlag - Gegenvorschlag/Optionen/Abstimmung -> Ergebnis



Eher weglassen im Scope der Semesterarbeit:

- Möglichst kein Login/Userverwaltung umsetzen ... entweder App so gestalten, dass dies gar nicht nötig ist oder gegebenfalls mocken (z.B. für die Demo "hart-codierte" User vorbereiten)





Mögliche zusätzliche Begeisterungsfaktoren

- Map Integration -> schon vorgesehen? ... macht es immer Sinn?



Gedanken:

- Möglichst bald konkretisieren ... Tip: In Szenarios denken: z.B. Familientreffen, Spieleabend, Firabe-Bier ... ist der Workflow immer derselbe oder gibt es Variationen?
  - Immer zwei Abstimmungen? -> Ort, Teilnehmer?

- Herausforderung: Wie macht ihr ein cooles UI?
  - Gundsätzlich werden ein paar Daten erfasst und angezeigt ... kann sehr "trocken" sein
- Backend: es braucht ein Backend, es handelt sich ja um eine verteilte Applikation und die Kommunikation ist ein essentieller Teil des Frontends
  - Im Backend: möglichst viel mocken, einfach halten
  - Schaut euch eine "Backend as a Servcice" Platform an:
    - Convex
    - Supabase
    - Firebase
    - Cloudflare: D1 Database, Pages, Workers
    - ....
    - Macht möglichst bald Experimente / einen POC für das Backend, auch wenn ihr euch z.B. noch nicht für das Frontend-Framewört entschieden habt
- Braucht es einen "Background-Prozess"? -> Abstimmung abschliessen
- Desktop vs. Mobile: Entscheidet euch früh was ihr unterstützen wollt. Deklariert das klar und fokussiert dann von Beginn nur auf das was ihr unterstützen wollt ...















# InfraImprover

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
