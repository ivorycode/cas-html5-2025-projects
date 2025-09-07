# FunOrganizer

## Projekt Eingabe

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



## Projekt Spezifikation



### Umfeld, Ausgangslage / Aufgabenstellung & Ziel

Viel klarere als noch in der Eingabe.
Mit dem mehrstufigen (open end?) Workflow nicht trivial.



### Scope: MVP - Muss Funktionen

=> habe den Eindruck, dass dies schon ein grosser Umfang ist

- ev. priorisieren?
  - z.B Karte: cool aber es geht auch ohne und es könnte am Schluss auch einigermassen unabhängig eingebaut werden

Umsetzung von "Benachrichtigungen"?

- Polling?
- Real-Time Feature von Supabase?
  - https://supabase.com/docs/guides/realtime/presence
  - https://supabase.com/docs/guides/realtime/postgres-changes

​	

Wie funktioniert das "Einladen von Teilnehmern" -> kann man nach allen existierenden (gemockten) Usern suchen? Oder muss werden "Kontakte" abgebildet?



### Architektur

- Hosting des Frontends? Supabase unterstützt soweit ich gesehen habe kein Frontend Deployment ...
- Mobile First oder "Mobile Only"?



### Routing / API

- zeigt das data-fetching
- mutations sind noch nicht abgebildet
  - z.B. an einer Abstimmung Teilnehmen braucht Infomrationen über das Event und die spezifische Abstimmung



### Datenbank Struktur:

Erscheint mir (zumindest vom Naming)  sehr "UI-Lastig" wäre es nicht besser mit den Domain-Begriffen (Event, Abstimmung ...) zu arbeiten?

"answer" -> solte aus meiner Sicht eher ein "questionformfield" referenzieren (ev. optional ein "questionoption") ... warum json / aggregation aller Antworten? Ist das effizient?

Müssten die "Benachrichtigungen" nicht auch in der DB abgebildet sein?





### Technologien

Passt, aber umfangreich!

=> da lernt ihr viel wenn ihr diese Technologien in den Stack aufnehmt, cool ... dokumentiert auch eure "Learnings" im Abschlussbericht ... villeicht würdet ihr etwas anders machen wenn ihr genügend Zeit hättet -> dokumentieren.

- TanstackQuery 
  - macht das Sinn zusammen mit Supabase? => Ja, ich denke das kann Sinn machen ...
  - ev. würden aber die Data-Loading Funktionalitäten von TanStack Router grundsätzlich für eure App genügen ...





### Wireframes:

Passt.
Herausforderungen im Screen Abstimmung:

- Wann wird etwas geschickt?
- Wie finden "real-time" updates statt?
- Konflikte vermeiden ...

