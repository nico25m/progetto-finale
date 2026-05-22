# Taskly

Taskly e una web app full stack per organizzare task tramite bacheche.

Il progetto permette agli utenti di registrarsi, accedere, disconnettersi e gestire bacheche personali o condivise tramite API RESTful sviluppate con Laravel.

## Obiettivo del progetto

L'applicazione permette di:

- creare bacheche;
- creare colonne personalizzate;
- creare task con priorita e tag;
- condividere bacheche tramite codice invito;
- gestire ruoli degli utenti;
- ricevere notifiche quando viene fatta una modifica all'interno di una bacheca condivisa.

## Tipo di applicazione

Taskly è una web app SPA.

Il frontend usa React Router per cambiare pagina senza ricaricare completamente il sito.

Le pagine principali sono:

- Home;
- Accedi;
- Registrati;
- Taskly, cioe la parte privata dell'app.

## Tecnologie usate

Backend:

- PHP;
- Laravel;
- Laravel Sanctum;
- API RESTful;
- MySQL configurando il file `.env`.

Frontend:

- React;
- Vite;
- React Router DOM;
- Axios;
- Tailwind CSS.

## Funzionalita principali

### Autenticazione

L'utente puo:

- registrarsi;
- accedere;
- disconnettersi.

L'autenticazione e gestita con Laravel Sanctum.

### Bacheche

Ogni utente puo creare piu bacheche.

Una bacheca contiene:

- nome;
- descrizione;
- colore;
- colonne;
- task;
- tag;
- membri;
- codice invito.

Quando un utente crea una bacheca diventa automaticamente `owner`.

### Colonne

Le colonne servono per dividere le task.

L'utente con i permessi giusti puo:

- creare colonne;
- modificare nome e colore;
- eliminare colonne.

Se una colonna contiene task, prima dell'eliminazione viene chiesta una conferma aggiuntiva.

### Task

Ogni task appartiene a una colonna.

Una task puo avere:

- titolo;
- descrizione;
- priorita;
- tag.

Le priorita:

- `bassa`;
- `media`;
- `alta`.

### Tag

I tag servono per distinguere meglio le task.

Ogni tag ha:

- nome;
- colore.

### Condivisione e ruoli

Una bacheca puo essere condivisa tramite codice invito.

I ruoli disponibili sono:

- `Proprietario`: proprietario della bacheca;
- `Amministratore`: puo gestire bacheca, colonne, tag e task;
- `Editor`: puo gestire le task;
- `Visualizzatore`: puo solo visualizzare.

Il proprietario puo modificare i ruoli degli utenti o rimuoverli dalla bacheca.

Gli utenti invitati possono anche abbandonare una bacheca.

### Notifiche

Taskly include un centro notifiche.

Le notifiche vengono create quando un utente compie azioni importanti in una bacheca condivisa, per esempio:

- crea una task;
- modifica una task;
- elimina una task;
- crea o elimina colonne;
- crea o elimina tag;
- entra o abbandona una bacheca.

## API principali

Endpoint pubblici:

```txt
POST /api/register
POST /api/login
```

Endpoint protetti con Sanctum:

```txt
GET    /api/user
POST   /api/logout

GET    /api/boards
POST   /api/boards
PUT    /api/boards/{board}
DELETE /api/boards/{board}
POST   /api/boards/join
DELETE /api/boards/{board}/leave
POST   /api/boards/{board}/invite

PUT    /api/board-members/{member}
DELETE /api/board-members/{member}

POST   /api/boards/{board}/columns
PUT    /api/columns/{column}
DELETE /api/columns/{column}

POST   /api/columns/{column}/tasks
PUT    /api/tasks/{task}
DELETE /api/tasks/{task}

POST   /api/boards/{board}/tags
PUT    /api/tags/{tag}
DELETE /api/tags/{tag}

GET    /api/notifications
PUT    /api/notifications/read
```

## Installazione

Requisiti:

- PHP 8.2 o superiore;
- Composer;
- Node.js;
- npm.

Clonare il progetto e installare le dipendenze:

```bash
composer install
npm install
```

Eseguire le migrazioni:

```bash
php artisan migrate
```

Avviare backend e frontend:

```bash
php artisan serve
npm run dev
```

Aprire il sito su:

```txt
http://127.0.0.1:8000
```

## Build di produzione

Per creare la build del frontend:

```bash
npm run build
```

## Struttura del progetto

Cartelle principali:

```txt
app/Http/Controllers   Controller delle API
app/Models             Modelli Laravel
database/migrations    Tabelle del database
routes/api.php         Rotte API RESTful
routes/web.php         Rotte web per la SPA
resources/js           Frontend React
resources/css          Stili globali e Tailwind
```


## Autore

Nicolò Melzi

📧 Email: nicomelzi05@gmail.com

[GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png) https://github.com/nico25m

[LinkedIn Logo](https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/linkedin.svg) https://linkedin.com/in/nicol%C3%B2-melzi