# FridgeBuddy

## Projekt Eingabe



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





## Projekt Spezifikation



### Scope: 

passt grundsätzlich

- Mocking von "Profil registrieren" und "User anmelden"
  - => Wie habt ihr das Mocking vorgesehen?
- Die 5 Use-Cases sind das MVP
  - Keine weiteren "Begeisterungsfaktoren" in Spezifikation vorgesehen.
    - relativ "simple" CRUD Applikation
    - => saubere Umsetzung des MVP steht folglich im Zentrum
  - Photo upload -> direkt von Kamera?



### Design / Architektur

- Datenmodell:
  - Bild direkt in DB speichern?
- Deployment:
  - render.com mit Python -> gute Wahl
  - Warum das Frontend nicht auch auf render.com deployen?
  - Ein oder zwei deployment pipelines?

### API-Endpoints

- Ist das komplett?
  - Reservation und Abholung sehe ich noch nicht abgebildet?
  - Lebensmittel suchen -> "gibt alle Items zurück" ??? ->  "filterbar" im Client?
  - "Pagination" ist auch noch nicht abgebildet (kann per Query Params gemacht werden)
  - User Registrieren => könnte man im Sinne von "Mocking" weglassen aus meinerr Sicht



### Technologiewahl

=> passt



### Wireframes

=> passt

- Festhalten: Mobile oder auch Desktop?





## Zwischenpräsentation

Miro: https://click.miro.com/f/a/-_C6fp3NnKHOqhfJG92wxg~~/AAAHahA~/rXJO4U4MCuayFVwBIcsSCBVb7XIIBvaY71r2Y-f1OLfCaqV8Os4io1rboeELi619-86GlHRAtP6VCXqJbnUdsVlEYupWf2GFRrMGGXJoIHK0rS5rgw-WWO5nGxSWwJire7Jc8XsUcfD5Q8ZsjJOYewgGZAt3Xu6ip48gmCoAzRBm3cx7_XMp0D0tZxNONatXaPh3laX2t7pB7hNaRwWM2wWiLXew76lIQEjyz55ubFHVN0C_FBWCXbajmmfcInUJs2zYFcssLL36jnHOEGmoYR4efKcjXOkrSdprzRoOteko4hBYxBzHJgSEzIKF8DOpZ_P0_etgv239aWJ7RHJBF2t-us_RPxN_AKwobLz6IB-hoYgQfjjrkD3L72AF_9patqtviuv1lmRpe7661HVM1rGqZ1a0kfMi5uvSEx3JV_-v-gGVxhqUBL7nnKKWYxZIbmL3uUjFm9d7oVruN_c_zT5HyFJrfL0dfA6-zuiKh1aVr9X0C3CRzlWGfVoY73Tk



Präsentation: https://bernerfachhochschule-my.sharepoint.com/:p:/r/personal/mulld7_bfh_ch/_layouts/15/Doc.aspx?sourcedoc=%7BAEBD76B5-0FAE-456D-AB37-C9C8F3723CA6%7D&file=fridgeBuddy.pptx&fromShare=true&action=edit&mobileredirect=true



Doku: https://bernerfachhochschule-my.sharepoint.com/:w:/r/personal/mulld7_bfh_ch/_layouts/15/Doc.aspx?sourcedoc=%7B857E173D-CAA6-46E4-AB95-978A9A95ABCE%7D&file=fridgeBuddyDokumentation.docx&fromShare=true&action=default&mobileredirect=true