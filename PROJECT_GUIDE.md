# DatingApp Projektguide

## Ziel dieses Dokuments
Dieses Dokument erklaert dein Projekt so, dass du den roten Faden verstehst und nicht nur einzelne Codezeilen auswendig lernst. Ich gehe das Projekt dateiweise durch und erklaere:

- welche Aufgabe die Datei hat
- wie die wichtigsten Zeilen funktionieren
- wie die Datei mit anderen Dateien zusammenarbeitet
- welche Stellen gut zum Lernen sind
- welche Stellen aktuell etwas unsauber oder fehleranfaellig sind

Wichtig: Eine echte "Wort fuer Wort"-Erklaerung fuer jede einzelne Zeile jeder Datei waere groesser als mehrere Buchkapitel. Deshalb ist der sinnvollste Weg:

1. erst den Gesamtfluss verstehen
2. dann Backend und Frontend getrennt lesen
3. danach die Details und Muster wiederholen

## Das Projekt in einem Satz
Das Projekt ist eine Fullstack-Dating-App mit:

- ASP.NET Core API im Ordner `API`
- Angular-Frontend im Ordner `client`
- SQLite als Datenbank
- JWT fuer Login/Auth
- Cloudinary fuer Bilderupload

## Was die App fachlich macht
Die App kann aktuell:

- Benutzer registrieren
- Benutzer einloggen
- JWT-Token erzeugen und bei Requests mitsenden
- Mitglieder aus der Datenbank laden
- ein Mitgliederprofil anzeigen
- Profildaten aktualisieren
- Fotos hochladen, Hauptfoto setzen und loeschen
- Fehlerfaelle absichtlich testen

Noch nicht fertig umgesetzt sind:

- echte Nachrichten
- echte Listen/Favoriten
- ausgearbeitete CSS-Dateien an vielen Stellen

## Gesamtfluss vom Start bis zur Antwort
Wenn du das ganze Projekt verstehen willst, ist das hier der wichtigste Ablauf:

1. Das Angular-Frontend startet ueber `client/src/main.ts`.
2. `app.config.ts` konfiguriert Router, HTTP-Interceptors und den App-Initializer.
3. `InitService` liest beim Start den User aus `localStorage`.
4. Wenn ein User eingeloggt ist, liegt sein JWT im Browser.
5. Der `jwtInterceptor` haengt dieses Token an API-Requests.
6. Die API startet ueber `API/Program.cs`.
7. `Program.cs` registriert Services, Datenbank, JWT-Authentifizierung und Middleware.
8. Requests gehen in Controller wie `AccountController` oder `MembersController`.
9. Die Controller sprechen ueber Repository/Services mit Datenbank oder Cloudinary.
10. Die API schickt JSON zurueck.
11. Angular-Services verarbeiten die Antworten und Komponenten zeigen sie an.

Wenn du nur einen einzigen End-to-End-Fluss lernen willst, nimm diesen:

1. Login im Navbar-Formular
2. `AccountService.login(...)`
3. `POST /api/account/login`
4. `AccountController.Login(...)`
5. Passwortvergleich mit HMAC
6. JWT-Erzeugung ueber `TokenService`
7. Rueckgabe von `UserDto`
8. `AccountService.setCurrentUser(...)`
9. Token landet in `localStorage`
10. spaetere Requests auf `/api/members` bekommen automatisch den `Authorization`-Header

## Leseschluessel fuer C#
Diese Begriffe tauchen im Backend staendig auf:

- `using`: bindet Namespaces ein, damit du Typen verwenden kannst
- `namespace API.Controllers;`: ordnet Klassen logisch ein
- `public class X(...) : BaseApiController`: Klasse mit Primary Constructor und Vererbung
- `Task<T>`: asynchrones Ergebnis, weil I/O wie Datenbank oder HTTP Zeit braucht
- `ActionResult<T>`: HTTP-Antwort, die entweder Daten oder Fehlerstatus enthalten kann
- `required`: diese Property muss beim Erzeugen gesetzt werden
- `string?`: nullable, also darf `null` sein
- `null!`: "vertrau mir", der Compiler soll Null-Warnungen hier unterdruecken
- `await`: auf asynchrone Operation warten
- `DbSet<T>`: Tabelle bzw. Sammlung von Entities in EF Core
- Extension Method: statische Methode, die so wirkt, als ob sie zur Klasse gehoert

## Leseschluessel fuer Angular
Diese Begriffe tauchen im Frontend staendig auf:

- `@Component(...)`: macht aus einer Klasse eine Angular-Komponente
- `imports: [...]`: diese Standalone-Komponente nutzt andere Angular-Bausteine
- `inject(Service)`: holt einen Service aus Angular DI
- `signal(...)`: reaktiver Zustand
- `input.required<T>()`: Property fuer Daten von der Eltern-Komponente
- `output<T>()`: Event, das an den Parent hochgeschickt wird
- `@if (...) { ... }`: neues Angular Control Flow fuer Bedingungen
- `@for (...) { ... }`: Schleife im Template
- `[(ngModel)]`: Two-Way-Binding, also Formularfeld <-> Klassenwert
- `Resolver`: laedt Daten vor dem Betreten einer Route
- `Guard`: erlaubt oder blockiert Navigation
- `Interceptor`: faengt HTTP-Requests/Responses zentral ab

## Wurzel des Projekts

### `DatingApp.slnx`
Diese Loesung sagt Visual Studio bzw. .NET, welche Projekte zur Solution gehoeren. Aktuell ist nur `API/API.csproj` eingetragen. Das Angular-Projekt wird separat ueber Node/Angular CLI verwaltet.

### `.gitignore`
Diese Datei sagt Git, welche Dateien nicht versioniert werden sollen, zum Beispiel Build-Artefakte, Abhaengigkeiten oder lokale Einstellungen. Sie gehoert nicht zur App-Logik.

### `.vscode/launch.json`
Lokale Debug-Konfiguration fuer VS Code.

- `C#: API Debug` startet das Backend-Projekt direkt
- `.NET Core Attach` haengt sich an einen schon laufenden .NET-Prozess

### `.vscode/settings.json`
Lokale Editor-Einstellungen fuer VS Code.

- organisiert Imports auf Wunsch
- formatiert C# beim Speichern

### `lernzeiten_tracker  (1).xlsx`
Das ist keine Laufzeitdatei der App. Vermutlich eine persoenliche Lern- oder Organisationsdatei.

## Backend: Ordner `API`

### `API/API.csproj`
Diese Datei ist die Projektdefinition fuer das Backend.

- `Sdk="Microsoft.NET.Sdk.Web"`: Webprojekt mit ASP.NET Core
- `TargetFramework net10.0`: Zielplattform ist .NET 10
- `Nullable enable`: Null-Sicherheit des Compilers ist aktiv
- `ImplicitUsings enable`: Standard-Namespaces werden automatisch importiert
- `PackageReference ...`: externe Bibliotheken wie EF Core, JWT und Cloudinary

Die `Folder Include`-Eintraege sind nur Visual-Studio-Hilfe, keine Laufzeitlogik.

### `API/Program.cs`
Das ist die wichtigste Startdatei des Backends.

- Die `using`-Zeilen machen Typen aus Daten-, Helper-, Service-, Auth- und EF-Core-Namespaces verfuegbar.
- `var builder = WebApplication.CreateBuilder(args);` erstellt den zentralen Builder fuer Konfiguration und DI.
- `builder.Services.AddControllers();` aktiviert Controller-basierte API-Endpunkte.
- `AddDbContext<AppDbContext>(...)` registriert die Datenbankanbindung.
- `UseSqlite(...)` sagt EF Core, dass SQLite benutzt wird.
- `builder.Services.AddCors();` aktiviert spaeter erlaubte Cross-Origin-Requests.
- `AddScoped<ITokenService, TokenService>();` bedeutet: Wenn jemand `ITokenService` braucht, gib pro Request eine Instanz von `TokenService`.
- Dasselbe passiert fuer `IPhotoService` und `IMemberRepository`.
- `Configure<CloudinarySettings>(...)` mappt Konfiguration auf die Klasse `CloudinarySettings`.
- `AddAuthentication(...).AddJwtBearer(...)` schaltet JWT-Authentifizierung ein.
- `tokenKey = builder.Configuration["TokenKey"]` liest den geheimen Signierschluessel aus der Konfiguration.
- `TokenValidationParameters` definiert, wie eingehende Tokens geprueft werden.
- `ValidateIssuerSigningKey = true` ist hier am wichtigsten: Token-Signatur muss stimmen.
- `var app = builder.Build();` erzeugt aus dem Builder die laufende App-Pipeline.
- `UseMiddleware<ExceptionMiddleware>();` faengt ungefangene Exceptions zentral ab.
- `UseCors(...)` erlaubt Requests vom Angular-Dev-Server auf Port 4200.
- `UseAuthentication();` liest das JWT und baut daraus einen `ClaimsPrincipal`.
- `UseAuthorization();` setzt `[Authorize]` um.
- `MapControllers();` mappt Controller-Routen auf HTTP-Endpunkte.
- Der `scope`-Block erstellt kurzzeitig einen Service-Scope fuer Startarbeiten.
- `context.Database.MigrateAsync();` wendet offene EF-Migrationen an.
- `Seed.SeedUsers(context);` legt Demodaten an, falls noch keine User existieren.
- Im `catch` wird der Fehler geloggt und weitergeworfen.
- `app.Run();` startet den Webserver.

Merke: `Program.cs` ist das Verkabelungszentrum, nicht der Ort fuer Fachlogik.

### `API/appsettings.Development.json`
Diese Datei enthaelt Entwicklungs-Konfiguration.

- `Logging`: wie viel geloggt wird
- `ConnectionStrings.DefaultConnection`: SQLite-Datei `dating.db`
- `TokenKey`: geheimer Schluessel fuer JWT-Signatur

Auffaellig: Eine `CloudinarySettings`-Section ist hier nicht vorhanden. Das heisst, die Cloudinary-Werte muessen entweder in User Secrets oder Umgebungsvariablen liegen, sonst funktioniert der Foto-Upload nicht.

### `API/Properties/launchSettings.json`
Diese Datei ist fuer lokales Starten.

- `commandName: Project`: starte dieses Projekt direkt
- `launchBrowser: false`: Browser nicht automatisch oeffnen
- `applicationUrl`: API laeuft lokal auf `https://localhost:5001`
- `ASPNETCORE_ENVIRONMENT=Development`: Entwicklungsumgebung aktiv

### `API/WeatherForecast.cs`
Klassisches Template-Beispiel von ASP.NET.

- `Date`, `TemperatureC`, `Summary`: einfache Datenfelder
- `TemperatureF => ...`: berechnete Readonly-Property mit Expression Body

Fuer deine App ist diese Datei nicht wichtig. Sie ist nur Rest vom Projekt-Template.

### `API/Controllers/BaseApiController.cs`
Diese Basisklasse spart Wiederholungen in allen Controllern.

- `[Route("api/[controller]")]`: Route basiert auf dem Controllernamen
- `[ApiController]`: aktiviert Komfortfunktionen wie automatische Model-Validation
- `ControllerBase`: Basisklasse fuer APIs ohne MVC-Views

Wenn also deine Klasse `AccountController` heisst, wird daraus automatisch `api/account`.

### `API/Controllers/AccountController.cs`
Hier passieren Registrierung und Login.

- Die Klasse bekommt `AppDbContext` und `ITokenService` direkt im Klassendeklarationskopf injiziert.
- `Register(RegisterDto registerDto)` bearbeitet `POST /api/account/register`.
- `EmailExists(...)` prueft zuerst, ob die Mail schon existiert.
- `using var hmac = new HMACSHA512();` erzeugt ein neues HMAC-Objekt.
- `PasswordHash = hmac.ComputeHash(...)` rechnet aus dem Klartextpasswort den Hash.
- `PasswordSalt = hmac.Key` speichert den zufaelligen Schluessel als Salt.
- Der neue User wird mit `context.Users.Add(user)` zum DbContext hinzugefuegt.
- `SaveChangesAsync()` schreibt in die DB.
- `return user.ToDto(tokenService);` wandelt die Entity in ein DTO um und haengt direkt ein JWT an.

Login:

- `SingleOrDefaultAsync(...)` sucht den User nach E-Mail.
- Falls nicht gefunden: `Unauthorized("Invalid email address")`
- `new HMACSHA512(user.PasswordSalt)` nutzt dasselbe Salt wie beim Registrieren.
- `computedHash` wird aus dem eingegebenen Passwort neu berechnet.
- Die `for`-Schleife vergleicht Byte fuer Byte gespeicherten und berechneten Hash.
- Wenn alles passt, wird wieder `UserDto` mit Token zurueckgegeben.

Wichtiger Lernpunkt: Es wird nie das Klartextpasswort gespeichert, nur Hash + Salt.

Wichtige Auffaelligkeit: Bei `Register(...)` wird nur `AppUser` erzeugt, aber kein `Member`. Spaetere Bereiche der App arbeiten aber mit `Member`. Dadurch ist ein neu registrierter User aktuell fachlich unvollstaendig.

### `API/Controllers/MembersController.cs`
Das ist der geschuetzte API-Bereich fuer Mitglieder.

- `[Authorize]` vor der Klasse bedeutet: alle Endpunkte brauchen ein gueltiges JWT.
- `GetMembers()` liefert die komplette Member-Liste.
- `GetMember(string id)` liefert ein einzelnes Mitglied ueber seine Id.
- `GetPhotosForMember(string id)` liefert nur Fotos des Mitglieds.
- `UpdateMember(MemberUpdateDto memberUpdateDto)` aktualisiert Profilfelder.
- `User.GetMemberId()` liest die User/Member-Id aus dem JWT.
- `GetMemberForUpdate(...)` laedt das Member inklusive `User` und `Photos`.
- Danach werden einzelne Felder auf neue Werte gesetzt, falls uebergeben.
- `member.User.DisplayName = ...` haelt den Anzeigenamen in `AppUser` und `Member` synchron.
- `SaveAllAsync()` speichert die Aenderungen.

Foto-Endpunkte:

- `AddPhoto(IFormFile file)` nimmt eine hochgeladene Datei entgegen.
- `photoService.UploadPhotoAsync(file)` schickt das Bild zu Cloudinary.
- Aus dem Ergebnis wird ein neues `Photo`-Objekt gebaut.
- Wenn das Mitglied noch kein `ImageUrl` hat, wird das erste Foto automatisch Hauptfoto.
- `member.Photos.Add(photo)` haengt das Foto an die Navigation Collection.

- `SetMainPhoto(int photoId)` sucht das Foto in der Foto-Liste des Members.
- Es gibt kein eigenes `IsMain`-Feld. Das Hauptfoto wird indirekt dadurch markiert, dass `member.ImageUrl` und `user.ImageUrl` auf diese Foto-URL gesetzt werden.

- `DeletePhoto(int photoId)` verbietet das Loeschen des aktuellen Hauptfotos.
- Wenn `PublicId` vorhanden ist, wird das Bild zuerst in Cloudinary geloescht.
- Dann wird das Foto aus `member.Photos` entfernt und gespeichert.

### `API/Controllers/BuggyController.cs`
Diese Datei ist absichtlich fuer Fehler-Tests da.

- `auth`: liefert 401
- `not-found`: liefert 404
- `server-error`: wirft absichtlich eine Exception
- `bad-request`: liefert 400

Sie hilft dir beim Testen der Angular-Error-Behandlung.

### `API/Controllers/WeatherForecastController.cs`
Auch das ist hauptsaechlich Template-Code.

- `Summaries` ist ein Array moeglicher Wettertexte.
- `Get()` baut 5 Zufalls-Wetterdaten per LINQ.

Fuer die Dating-App ist diese Datei funktional irrelevant.

### `API/DTOs/RegisterDto.cs`
DTO fuer Registrierungsdaten.

- `[Required]`: Feld muss gesendet werden
- `[EmailAddress]`: E-Mail-Format wird validiert
- `[MinLength(4)]`: Passwort mindestens 4 Zeichen
- `= ""`: verhindert Null-Warnungen

### `API/DTOs/LoginDto.cs`
DTO fuer Login.

- `Email` und `Password` werden angenommen
- es fehlen hier aber DataAnnotations wie `[Required]`

Lernpunkt: DTOs sind Transportobjekte, keine Datenbanktabellen.

### `API/DTOs/UserDto.cs`
Antwortmodell nach Login/Register.

- enthaelt `Id`, `Email`, `DisplayName`, optional `ImageUrl`, `Token`
- das Frontend braucht genau diese Daten fuer Session und UI

### `API/DTOs/MemberUpdateDto.cs`
Nur die aenderbaren Profildaten.

- `DisplayName`, `Description`, `City`, `Country`
- alles nullable, damit partielle Updates moeglich sind

### `API/DTOs/SeedUserDto.cs`
Dieses DTO passt zur Struktur der JSON-Seeddaten.

- es enthaelt alles, was fuer Demo-User noetig ist
- `DateOfBirth`, `Created`, `LastActive` zeigen verschiedene Datentypen

### `API/Entities/AppUser.cs`
Das ist das Auth-/Account-Objekt.

- `Id` wird als Guid-String vorbelegt
- `DisplayName`, `Email`, `PasswordHash`, `PasswordSalt` sind Pflichtwerte
- `ImageUrl` ist optional
- `Member Member` ist die 1:1-Navigation zum fachlichen Profil

Man kann sagen:

- `AppUser` = Login-Identitaet
- `Member` = oeffentliches Profil

### `API/Entities/Member.cs`
Das ist das fachliche Profil.

- `Id` ist auch hier die Id und gleichzeitig Foreign Key auf `AppUser`
- `DateOfBirth`, `DisplayName`, `Gender`, `City`, `Country` sind Kernprofildaten
- `Created` und `LastActive` haben Standardwerte `UtcNow`
- `Photos` ist die Foto-Liste
- `[JsonIgnore]` verhindert Zyklen und unnoetige Daten in JSON-Antworten
- `[ForeignKey(nameof(Id))]` sagt EF: dieselbe Spalte `Id` ist auch FK zu `AppUser`

Das ist eine 1:1-Beziehung mit Shared Primary Key.

### `API/Entities/Photo.cs`
Foto-Entity.

- `Id`: Integer Primary Key
- `Url`: oeffentliche Bildadresse
- `PublicId`: Cloudinary-interne Id zum spaeteren Loeschen
- `MemberId`: Foreign Key zum Besitzer
- `Member`: Navigation zum zugehoerigen Mitglied

### `API/Data/AppDbContext.cs`
EF-Core-Kontext, also Bruecke zwischen C#-Klassen und Datenbank.

- `DbSet<AppUser> Users`: Tabelle `Users`
- `DbSet<Member> Members`: Tabelle `Members`
- `DbSet<Photo> Photos`: Tabelle `Photos`

`DbContextOptions options` kommen von `Program.cs`.

### `API/Data/MemberRepository.cs`
Hier ist der Datenzugriff fuer Mitglieder gekapselt.

- `GetMemberByIdAsync` nutzt `FindAsync(id)` fuer schnelles Laden per Primary Key
- `GetMemberForUpdate` laedt `User` und `Photos` mit `Include`, weil sie spaeter benoetigt werden
- `GetMembersAsync` liefert alle Members
- `GetPhotosForMemberAsync` geht ueber `Members -> SelectMany(Photos)`
- `SaveAllAsync` speichert Aenderungen und gibt `true` zurueck, wenn mindestens 1 Zeile betroffen war
- `Update(Member member)` setzt den Entity State auf `Modified`

Lernpunkt: Ein Repository versteckt EF-Details vor dem Controller.

### `API/Data/Seed.cs`
Diese Datei fuellt die Datenbank beim Start mit Demo-Usern.

- `if (await context.Users.AnyAsync()) return;` verhindert doppeltes Seeden
- `ReadAllTextAsync("Data/UserSeedData.json")` laedt die JSON-Datei
- `JsonSerializer.Deserialize<List<SeedUserDto>>(...)` wandelt JSON in C#-Objekte
- fuer jedes Seed-Member wird ein `AppUser` erstellt
- das Default-Passwort ist fuer alle `Pa$$w0rd`
- gleichzeitig wird ein zugehoeriges `Member`-Objekt erstellt
- danach wird ein erstes `Photo` mit der vorhandenen `ImageUrl` angehaengt
- am Ende speichert `SaveChangesAsync()` alles auf einmal

### `API/Data/UserSeedData.json`
Das sind die Demo-Daten fuer `Seed.cs`.

- jeder JSON-Eintrag entspricht einem `SeedUserDto`
- Felder wie `Gender`, `City`, `ImageUrl` landen spaeter im `Member`
- diese Datei ist keine Logik, aber sehr wichtig fuer Testdaten

### `API/Extensions/AppUserExtensions.cs`
Extension Method fuer `AppUser`.

- `ToDto(this AppUser user, ITokenService tokenService)` fuehlt sich spaeter an wie `user.ToDto(...)`
- baut ein `UserDto`
- erzeugt ueber `tokenService.CreateToken(user)` direkt das JWT

Lernpunkt: Extensions machen Aufrufcode lesbarer.

### `API/Extensions/ClaimsPrincipalExtensions.cs`
Hilfsmethode fuer den eingeloggten Benutzer.

- `ClaimsPrincipal` repraesentiert den authentifizierten User
- `FindFirstValue(ClaimTypes.NameIdentifier)` liest die Id aus dem JWT
- wenn keine Id existiert, wird eine Exception geworfen

So muss der Controller nicht jedes Mal denselben Claim-Zugriff wiederholen.

### `API/Interfaces/ITokenService.cs`
Vertrag fuer Token-Erzeugung.

- ein Service, eine Methode: `CreateToken(AppUser user)`

### `API/Interfaces/IPhotoService.cs`
Vertrag fuer Bild-Upload und Bild-Loeschung.

- `UploadPhotoAsync(IFormFile file)`
- `DeletePhotoAsync(string publicId)`

### `API/Interfaces/IMemberRepository.cs`
Vertrag fuer Member-Datenzugriff.

- lesen, aktualisieren, speichern, Fotos holen

Interfaces machen Klassen austauschbarer und testbarer.

### `API/Services/TokenService.cs`
Hier wird das JWT gebaut.

- `config["TokenKey"]` liest den geheimen Schluessel
- die Laengenpruefung `tokenKey.Length < 64` zwingt zu einem ausreichend starken Key
- `SymmetricSecurityKey(...)` baut den Signierschluessel
- `claims` enthaelt `Email` und `NameIdentifier`
- `SigningCredentials` sagen, womit signiert wird
- `SecurityTokenDescriptor` beschreibt das Token
- `Expires = DateTime.Now.AddDays(7)` macht das Token 7 Tage gueltig
- `JwtSecurityTokenHandler` erstellt und serialisiert das Token

### `API/Services/PhotoService.cs`
Dieser Service spricht mit Cloudinary.

- Im Konstruktor werden `CloudName`, `ApiKey`, `ApiSecret` aus `CloudinarySettings` gelesen.
- Daraus wird ein `Account` gebaut.
- `_cloudinary = new Cloudinary(acc);` initialisiert den SDK-Client.

Upload:

- `ImageUploadResult uploadResult = new ImageUploadResult();`
- wenn `file.Length > 0`, wird die Datei gelesen
- `FileDescription(file.FileName, stream)` beschreibt den Upload-Inhalt
- `Transformation().Height(500).Width(500).Crop("fill").Gravity("face")` sorgt fuer quadratischen Zuschnitt mit Fokus aufs Gesicht
- `Folder = "da-ang20"` speichert Bilder in einem Cloudinary-Ordner

Delete:

- `DeletionParams(publicId)` beschreibt, welches Bild geloescht werden soll
- `DestroyAsync(...)` fuehrt das Loeschen aus

### `API/Helpers/CloudinarySettings.cs`
Starke Typisierung fuer Konfigurationswerte.

- `CloudName`
- `ApiKey`
- `ApiSecret`

### `API/Middleware/ExceptionMiddleware.cs`
Globale Fehlerbehandlung.

- `await next(context);` gibt den Request an die naechste Middleware weiter
- wenn irgendwo spaeter eine Exception auftritt, faengt `catch` sie ab
- es wird auf `application/json` gesetzt
- HTTP-Status wird `500`
- im Development bekommt der Client die echte Fehlermeldung plus StackTrace
- ausserhalb Development bekommst du nur generische Details
- `JsonSerializerOptions` mit `CamelCase` passen die JSON-Namen ans Frontend an

Lernpunkt: Middleware liegt vor dem Controller und kann jeden Request global beeinflussen.

### `API/Errors/ApiException.cs`
Ein einfaches Fehler-Antwortmodell mit:

- `StatusCode`
- `Message`
- `Details`

### `API/Data/Migrations/20260308114849_InitialCreate.cs`
Erste EF-Migration.

- erstellt die Tabelle `Users`
- `Down(...)` loescht sie wieder

### `API/Data/Migrations/20260309110635_AddImageUrlToAppUser.cs`
Zweite Migration.

- fuegt `ImageUrl` zur Tabelle `Users` hinzu

### `API/Data/Migrations/20260309111044_PendingModelCheck.cs`
Leere Migration.

- `Up(...)` und `Down(...)` sind leer
- das ist meist ein Synchronisationsartefakt von EF Core

### `API/Data/Migrations/20260315131502_MemberEntityAdded.cs`
Wichtige Migration fuer Profile und Fotos.

- macht `Users.ImageUrl` nullable
- erstellt `Members`
- erstellt `Photos`
- baut den Foreign Key `Members.Id -> Users.Id`
- baut den Foreign Key `Photos.MemberId -> Members.Id`
- legt einen Index auf `Photos.MemberId`

### `API/Data/Migrations/AppDbContextModelSnapshot.cs`
Auto-generierte Momentaufnahme des aktuellen EF-Modells.

- EF Core vergleicht diesen Snapshot mit deinen Entities, um neue Migrationen zu erzeugen
- nicht per Hand pflegen

### `API/Data/Migrations/*.Designer.cs`
Die drei `*.Designer.cs`-Dateien gehoeren zu den jeweiligen Migrationen.

- sie sind auto-generiert
- sie enthalten das Modell, wie EF es genau zu diesem Migrationszeitpunkt sah
- fuer Verstehen hilfreich, aber normalerweise nicht manuell bearbeiten

## Frontend: Ordner `client`

### `client/package.json`
Die Node/Angular-Projektdefinition.

- `scripts.start`: `ng serve`
- `scripts.build`: Produktionsbuild
- `scripts.test`: Tests
- `dependencies`: Bibliotheken zur Laufzeit
- `devDependencies`: Werkzeuge fuer Build/Test
- Angular 21, Tailwind 4 und DaisyUI sind hier die wichtigsten Abhaengigkeiten

### `client/package-lock.json`
Von npm generierte Lockdatei.

- fixiert exakte Versionen aller Pakete
- keine App-Logik
- normalerweise nicht manuell editieren

### `client/angular.json`
Zentrale Angular-CLI-Konfiguration.

- `projectType: application`: Browser-App
- `sourceRoot: src`: Quellcode liegt unter `src`
- `schematics`: Generator-Defaults fuer Komponenten, Services, Guards, Interceptors und Pipes
- `build.options.browser: src/main.ts`: Einstiegspunkt
- `assets`: statische Dateien aus `public`
- `styles`: globale CSS-Datei
- `development.fileReplacements`: ersetzt `environment.ts` durch `environment.development.ts`
- `serve.options.ssl`: lokaler Dev-Server laeuft mit HTTPS

### `client/tsconfig.json`
Grundkonfiguration fuer TypeScript.

- `strict: true`: strenge Typsicherheit
- weitere `noImplicit...`-Regeln erzwingen saubereren Code
- `angularCompilerOptions.strictTemplates: true` macht auch Templates strenger

### `client/tsconfig.app.json`
Build-Konfiguration fuer die App selbst.

- inkludiert `src/**/*.ts`
- schliesst Spec-Dateien aus

### `client/tsconfig.spec.json`
TypeScript-Konfiguration fuer Tests.

- bindet `vitest/globals` ein

### `client/README.md`
Standard-README des Angular-CLI-Templates. Hilfreich fuer Standardkommandos, aber nicht spezifisch fuer deine App.

### `client/ssl/localhost.pem` und `client/ssl/localhost-key.pem`
Lokale Zertifikate fuer HTTPS beim Angular-Dev-Server.

- wichtig, weil die API lokal auch ueber HTTPS laeuft
- keine Fachlogik

### `client/public/favicon.ico`
Browser-Icon.

### `client/public/user.png`
Fallback-Bild fuer Benutzer ohne Foto.

### `client/src/index.html`
Das eigentliche HTML-Dokument, in das Angular spaeter rendert.

- `class="bg-base-300"` setzt direkt ein DaisyUI/Tailwind-Theme-Styling
- `#initial-splash` ist ein Start-Splashscreen
- `<app-root></app-root>` ist der Platzhalter fuer die Angular-App

Der Splashscreen wird spaeter in `app.config.ts` entfernt.

### `client/src/styles.css`
Globale Styles.

- `@import "tailwindcss";` aktiviert Tailwind
- `@plugin "daisyui"` bindet DaisyUI ein
- `themes: all` aktiviert alle DaisyUI-Themes

### `client/src/main.ts`
Angular-Einstiegspunkt.

- `bootstrapApplication(App, appConfig)` startet die Standalone-App
- `catch(...)` loggt Boot-Fehler

### `client/src/app/app.config.ts`
Das ist die zentrale Angular-Konfiguration.

- `provideBrowserGlobalErrorListeners()`: globale Fehler-Listener
- `provideZonelessChangeDetection()`: modernes Angular ohne Zone.js-Change-Detection
- `provideRouter(routes, withViewTransitions())`: Router und Seitenuebergaenge
- `provideHttpClient(withInterceptors([...]))`: HttpClient plus Interceptors
- `provideAppInitializer(...)`: Code, der vor dem App-Start laeuft

Im Initializer:

- `const initService = inject(InitService);`
- `lastValueFrom(initService.Init())` wartet auf das Observable
- der `setTimeout(..., 500)` sorgt dafuer, dass der Splashscreen kurz sichtbar bleibt
- im `finally` wird `#initial-splash` aus dem DOM entfernt

### `client/src/app/app.ts`
Root-Komponente.

- `imports: [Nav, RouterOutlet]`: App zeigt Navbar plus Routeninhalt
- `protected router = inject(Router);` wird im Template genutzt

### `client/src/app/app.html`
Root-Template.

- `<app-nav />` rendert die Navbar immer
- der umgebende `div` bekommt nur ausserhalb der Startseite Margin/Container-Klassen
- `<router-outlet />` ist Platzhalter fuer die aktive Seite

### `client/src/app/app.css`
Aktuell leer.

### `client/src/app/app.routes.ts`
Die zentrale Routenliste.

- `path: ''` mit `Home` ist die Startseite
- der zweite Block `path: ''` mit `canActivate: [authGuard]` schuetzt Unterrouten
- `/members` zeigt die Member-Liste
- `/members/:id` zeigt die Detailansicht eines Mitglieds
- `resolve: { member: memberResolver }` laedt das Member vor dem Betreten der Detailroute
- die Kindrouten `profile`, `photos`, `messages` werden im `router-outlet` der Detailkomponente angezeigt
- `canDeactivate: [preventUnsavedChnagesGuard]` verhindert Wegnavigation mit ungespeicherten Aenderungen
- `/errors` zeigt die Testseite fuer API-Fehler
- `/server-error` zeigt Fehlerdetails
- `**` faengt alle unbekannten Pfade ab

### `client/src/layout/theme.ts`
Liste aller verfuegbaren DaisyUI-Themes. Die Navbar nutzt diese Liste fuer den Theme-Dropdown.

### `client/src/environments/environment.ts`
Produktionskonfiguration.

- `production: true`
- `apiUrl: 'api/'`

Das ist sinnvoll, wenn Frontend und API spaeter unter derselben Domain laufen.

### `client/src/environments/environment.development.ts`
Entwicklungs-Konfiguration.

- `production: false`
- `apiUrl: 'https://localhost:5001/api/'`

### `client/src/types/user.ts`
TypeScript-Typen fuer User und Credentials.

- `User`: Daten aus `UserDto`
- `LoginCreds`: Formular fuer Login
- `RegisterCreds`: Formular fuer Registrierung

### `client/src/types/member.ts`
Typen fuer Member, Photo und editierbares Profil.

- `Member`: Datenstruktur fuer Profildaten
- `Photo`: Bilddaten
- `EditableMember`: nur bearbeitbare Felder

Auffaellig: `age: string` in `Member` passt nicht zur API und wird gar nicht benoetigt, weil das Alter ueber `AgePipe` aus `dateOfBirth` berechnet wird.

### `client/src/types/error.ts`
Typ fuer Fehlerdaten aus dem Server-Error-Screen.

- `message`
- `statusCode`
- `details`

## Frontend: Core-Services, Guards, Interceptors und Pipe

### `client/src/core/services/account-service.ts`
Zustand und API-Aufrufe fuer Login/Registrierung.

- `currentUser = signal<User | null>(null);` globaler Session-Zustand
- `baseUrl = environment.apiUrl;` API-Basisadresse
- `register(...)` ruft `POST account/register`
- `login(...)` ruft `POST account/login`
- `tap(user => this.setCurrentUser(user))` speichert den User nach erfolgreicher Antwort
- `setCurrentUser(...)` schreibt in `localStorage` und ins Signal
- `logout()` loescht beides

### `client/src/core/services/member-service.ts`
API-Aufrufe und Zustand fuer Member.

- `editMode = signal(false);` steuert, ob Profil/Fotos im Edit-Modus sind
- `member = signal<Member | null>(null);` haelt aktuell geoeffnetes Mitglied
- `getMembers()` laedt alle Mitglieder
- `getMember(id)` laedt ein Mitglied und schreibt es mit `tap(...)` ins Signal
- `getMemberPhotos(id)` laedt Fotos
- `updateMember(...)`, `uploadPhoto(...)`, `setMainPhoto(...)`, `deletePhoto(...)` sprechen die zugehoerigen API-Endpunkte an

Auffaellig: `tap` wird hier aus `rxjs/internal/operators/tap` importiert. Das ist ein interner Pfad und unsauber. Besser waere ein oeffentlicher Import aus `rxjs`.

### `client/src/core/services/init-service.ts`
Startservice fuer Session-Wiederherstellung.

- liest `localStorage.getItem('user')`
- wenn nichts da ist: `of(null)`
- sonst `JSON.parse(...)`
- setzt den User direkt ins `AccountService.currentUser`

Damit bleibt der Login nach einem Reload erhalten.

### `client/src/core/services/busy-service.ts`
Ein sehr einfacher Ladezustands-Service.

- `BusyRequestCount` ist ein Zaehler als Signal
- `busy()` erhoeht den Zaehler
- `idle()` verringert den Zaehler, aber nie unter 0

Die Navbar zeigt auf Basis dieses Zaehlerwerts den Spinner.

### `client/src/core/services/toast-service.ts`
Dieser Service baut Toaster-Nachrichten direkt im DOM.

- Im Konstruktor wird der Toast-Container erzeugt
- `createToastElement(...)` baut ein `div` mit Alert-Klassen
- der Close-Button entfernt den Toast manuell
- `setTimeout(...)` entfernt ihn nach einer Zeit automatisch
- `success/error/warning/info` sind nur Komfort-Methoden

Auffaellig: Das `x`-Symbol im Button ist als kaputter Zeichensatz gespeichert (`âœ•`). Das ist kein Logikfehler, aber ein Encoding-Problem.

### `client/src/core/guards/auth-guard.ts`
Schuetzt Routen.

- holt `AccountService`
- wenn `currentUser()` gesetzt ist, return `true`
- sonst Toast anzeigen und `false`

Merke: Guard entscheidet nur ueber Navigation im Frontend. Echte Sicherheit macht weiterhin das Backend mit `[Authorize]`.

### `client/src/core/guards/prevent-unsaved-chnages-guard.ts`
Verhindert, dass man ein dirty Formular versehentlich verlaesst.

- der Guard bekommt die Komponente `MemeberProfile`
- wenn `component.editForm?.dirty`, erscheint `confirm(...)`
- sonst sofort `true`

### `client/src/core/interceptors/jwt-interceptor.ts`
Haengt JWT an ausgehende Requests.

- `user = accoutnservice.currentUser()`
- wenn User existiert, wird der Request geklont
- `Authorization: Bearer ${user.token}` wird gesetzt

Wichtiger Lernpunkt: `HttpRequest` ist immutable, deshalb `clone(...)`.

### `client/src/core/interceptors/error-interceptor.ts`
Zentrale Fehlerbehandlung fuer HTTP-Antworten.

- `catchError(...)` faengt API-Fehler ab
- `400`:
- wenn `error.error.errors` existiert, werden Validierungsfehler eingesammelt und als Array geworfen
- sonst Toast mit Servertext
- `401`: Unauthorized-Toast
- `404`: Navigation zu einer NotFound-Seite
- `500`: Navigation zu `/server-error` und Uebergabe der Error-Daten per Router-State
- `default`: generischer Fehler-Toast

Auch hier wird aus einem internen RxJS-Pfad importiert. Das sollte man spaeter bereinigen.

### `client/src/core/interceptors/loading-interceptor.ts`
Verwaltet Ladezustand und cacht GET-Requests.

- `cache = new Map<string, HttpEvent<unknown>>()`: einfacher In-Memory-Cache
- bei GET wird geprueft, ob die URL schon im Cache liegt
- falls ja, wird direkt `of(cachedResponse)` zurueckgegeben
- sonst `busyService.busy()`
- `delay(500)` verlangsamt jede Antwort kuenstlich etwas
- `tap(Response => cache.set(req.url, Response))` legt die Antwort im Cache ab
- `finalize(...)` setzt den Busy-Zaehler wieder herunter

Das Konzept funktioniert, hat aber zwei Risiken:

- Mutationen wie `PUT`, `POST`, `DELETE` invalidieren den Cache nicht, dadurch koennen alte GET-Daten haengen bleiben.
- Es wird `HttpEvent` gecacht, nicht explizit nur die finale `HttpResponse`.

### `client/src/core/pipes/age-pipe.ts`
Berechnet aus dem Geburtsdatum das Alter.

- `today` und `dob` werden als `Date` gebaut
- Jahresdifferenz gibt die Basis
- wenn Geburtstag dieses Jahr noch nicht war, wird 1 abgezogen

## Frontend: Layout und Feature-Komponenten

### `client/src/layout/nav/nav.ts`
Die Navbar ist sehr zentral fuer Login, Logout, Theme und Spinner.

- `accountService` wird im Template fuer Loginstatus genutzt
- `busyService` liefert den Spinner-Zustand
- `creds: any = {}` speichert Formulardaten fuer Login
- `selectedTheme` ist ein Signal mit dem Wert aus `localStorage`
- `ngOnInit()` setzt das HTML-Attribut `data-theme`
- `handleThemeChange(...)` aendert Theme, speichert es und entfernt den Fokus vom aktiven Element
- `login()` ruft `accountService.login(...)`
- bei Erfolg: Route `/members`, Success-Toast, Formular zuruecksetzen
- `logout()` loescht Session und geht auf `/`

### `client/src/layout/nav/nav.html`
Die Navbar-Struktur.

- linkes Logo fuehrt zur Startseite
- Navigationseintraege `Matches`, `Lists`, `Messages` erscheinen nur, wenn ein User eingeloggt ist
- `Errors` ist immer sichtbar
- der Spinner erscheint bei `BusyRequestCount() > 0`
- Theme-Dropdown listet alle Themes aus `theme.ts`
- wenn ein User eingeloggt ist, erscheint rechts Avatar + Name + Dropdown
- wenn kein User eingeloggt ist, erscheint das Login-Formular

### `client/src/layout/nav/nav.css`
Aktuell leer.

### `client/src/features/home/home.ts`
Steuert den Wechsel zwischen Landing-Ansicht und Registrierungsformular.

- `registerMode = signal(false)`
- `showRegister(value: boolean)` setzt diesen Zustand

### `client/src/features/home/home.html`
Landingpage.

- wenn `registerMode()` false ist, zeigst du die Hero-Ansicht
- Klick auf `Register` schaltet `registerMode` auf `true`
- dann wird `<app-register />` angezeigt

### `client/src/features/home/home.css`
Aktuell leer.

### `client/src/features/account/register/register.ts`
Registrierungs-Komponente.

- `cancelRegister = output<boolean>()` ist das Event an die Parent-Komponente
- `creds` enthaelt Formulardaten
- `register()` ruft den Account-Service
- bei Erfolg wird `cancel()` aufgerufen
- `cancel()` emittiert `false`, sodass `Home` wieder den Hero-Bildschirm zeigt

Auffaellig:

- `console.log(...)` statt echter User-Rueckmeldung
- kein automatisches Routing nach Registrierung
- importiertes `input` wird nicht verwendet

### `client/src/features/account/register/register.html`
Template fuer Registrierung.

- `#registerForm="ngForm"` macht das Formular in Angular referenzierbar
- `(ngSubmit)="register()"` koppelt Submit an die Methode
- `[(ngModel)]="creds.email"` etc. binden die Inputs an die Klasse

### `client/src/features/account/register/register.css`
Aktuell leer.

### `client/src/features/members/member-resolver.ts`
Laedt das Member vor dem Aktivieren der Detailroute.

- liest `id` aus der URL
- wenn keine `id` da ist, geht es zu NotFound und `EMPTY` wird zurueckgegeben
- sonst `memberService.getMember(memberId)`

Der Resolver sorgt dafuer, dass `MemberDetailed` beim Anzeigen schon Daten hat.

### `client/src/features/members/member-list/member-list.ts`
Listen-Seite fuer alle Members.

- `members$` ist ein Observable der Member-Liste
- im Konstruktor wird `getMembers()` sofort gestartet

### `client/src/features/members/member-list/member-list.html`
Ein Grid mit Member-Karten.

- `@for (member of members$ | async; track member.id)` iteriert ueber das Observable-Ergebnis
- jede Karte ist eine `app-member-card`

### `client/src/features/members/member-list/member-list.css`
Aktuell leer.

### `client/src/features/members/member-card/member-card.ts`
Kleine Darstellung eines Members.

- `member = input.required<Member>()` verlangt einen Member vom Parent
- `AgePipe` wird importiert, damit das Alter im Template berechnet werden kann

### `client/src/features/members/member-card/member-card.html`
Darstellung eines Profils in Kartenform.

- gesamte Karte hat `routerLink="/members/{{member.id}}"`
- Bild zeigt `member.imageUrl` oder Fallback
- unten liegt ein Overlay mit Name, Alter und Stadt

### `client/src/features/members/member-card/member-card.css`
Aktuell leer.

### `client/src/features/members/member-detailed/member-detailed.ts`
Container-Komponente fuer die Detailseite.

- `memberService.member()` liefert das aktuell geladene Mitglied
- `title` ist ein Signal fuer den aktiven Reitername
- `isCurrentUser` vergleicht URL-Id mit der eingeloggten User-Id
- `ngOnInit()` setzt den initialen Titel aus der ersten Child-Route
- per `router.events` und `NavigationEnd` wird der Titel aktualisiert, wenn innerhalb der Tabs navigiert wird

### `client/src/features/members/member-detailed/member-detailed.html`
Layout fuer Profil/Fotos/Messages.

- linke Seite: Profilkarte mit Bild, Grunddaten und Tab-Menue
- rechte Seite: Bereich fuer den aktiven Untertab
- `Edit`-Button erscheint nur beim eigenen Profil
- der Button toggelt `memberService.editMode`
- `<router-outlet>` rendert `MemeberProfile`, `MemeberPhotos` oder `MemeberMessages`

### `client/src/features/members/member-detailed/member-detailed.css`
Aktuell leer.

### `client/src/features/members/memeber-profile/memeber-profile.ts`
Komponente fuer das Profil und dessen Bearbeitung.

- `@ViewChild('editForm')` greift auf das Angular-Formular zu
- `@HostListener('window:beforeunload', ...)` warnt beim Tab-Schliessen mit dirty Formular
- `editableMember` ist eine lokale Kopie der editierbaren Felder
- in `ngOnInit()` werden Werte aus `memberService.member()` uebernommen
- `updateProfile()` ruft `memberService.updateMember(...)`
- nach Erfolg:
- der `displayName` im aktuellen User wird bei Bedarf aktualisiert
- Success-Toast wird gezeigt
- `editMode` wird beendet
- das Member-Signal wird auf den neuen Stand gesetzt
- `editForm.reset(this.editableMember)` markiert das Formular wieder als sauber
- `ngOnDestroy()` beendet vorsichtshalber den Edit-Modus

### `client/src/features/members/memeber-profile/memeber-profile.html`
Zeigt Profilinfos oder das Bearbeitungsformular.

- im Lesemodus: `created`, `lastActive`, `description`
- im Edit-Modus: Formular fuer `displayName`, `description`, `city`, `country`
- Submit-Button ist nur aktiv, wenn das Formular dirty ist

Auffaellig: Das Feld `Description` ist doppelt eingebaut. Das ist ziemlich sicher ein Copy-Paste-Fehler.

### `client/src/features/members/memeber-profile/memeber-profile.css`
Aktuell leer.

### `client/src/features/members/memeber-photos/memeber-photos.ts`
Verwaltet Fotoansicht und Fotoaktionen.

- `photos = signal<Photo[]>([])` speichert die geladenen Fotos
- `loading = signal(false)` steuert Upload-Spinner
- `ngOnInit()` liest die Parent-Route-Id und laedt die Fotos
- `onUploadImage(file)` startet Upload, setzt Loading und fuegt das neue Foto lokal an
- `onSetMainPhoto(photo)` ruft API, aktualisiert danach `currentUser.imageUrl` und `memberService.member().imageUrl`
- `deletePhoto(photoId)` loescht in API und entfernt es lokal aus `photos`

### `client/src/features/members/memeber-photos/memeber-photos.html`
Zeigt entweder Foto-Galerie oder Upload-Komponente.

- wenn nicht im Edit-Modus: Galerie
- wenn im Edit-Modus: `<app-image-upload />`
- fuer das eigene Profil erscheinen `app-star-button` und `app-delete-button`
- Hauptfoto kann nicht als Hauptfoto gesetzt oder geloescht werden

### `client/src/features/members/memeber-photos/memeber-photos.css`
Aktuell leer.

### `client/src/features/members/memeber-messages/memeber-messages.ts`
Platzhalter-Komponente fuer spaetere Nachrichtenfunktion.

### `client/src/features/members/memeber-messages/memeber-messages.html`
Nur Platzhaltertext.

### `client/src/features/members/memeber-messages/memeber-messages.css`
Aktuell leer.

### `client/src/shared/image-upload/image-upload.ts`
Wiederverwendbare Upload-Komponente.

- `imageSrc` haelt Vorschaubild
- `isDragging` steuert Dropzone-Zustand
- `fileToUpload` speichert die gewaehlt/gedroppte Datei
- `uploadFile = output<File>()` schickt die Datei an den Parent
- `loading = input<boolean>(false)` erlaubt Parent-gesteuerten Ladezustand
- `onDragOver`, `onDragLeave`, `onDrop` steuern Drag-and-Drop
- `prviewImage(file)` liest per `FileReader` eine Vorschau als DataURL
- `onUploadFile()` emittiert die Datei
- `onCancel()` verwirft Auswahl und Preview

Auffaellig:

- `prviewImage` ist nur ein Schreibfehler im Methodennamen
- das versteckte `<input type="file">` wird im Code nicht verarbeitet, also funktioniert aktuell effektiv nur Drag-and-Drop bzw. das Label ohne ausgelesenen Change-Handler

### `client/src/shared/image-upload/image-upload.html`
Dropzone + Preview + Aktionsbuttons.

- linke Seite: Dropzone
- rechte Seite erscheint erst, wenn eine Vorschau existiert
- `Upload image` ist bei `loading()` deaktiviert

### `client/src/shared/image-upload/image-upload.css`
Aktuell leer.

### `client/src/shared/star-button/star-button.ts`
Kleine Button-Komponente fuer "als Hauptfoto setzen".

- `selected` und `disabled` kommen vom Parent
- `clickEvent` wird nach oben emittiert

### `client/src/shared/star-button/star-button.html`
SVG-Sternbutton.

- Fill wird nur gesetzt, wenn `selected()` true ist
- CSS-Klassen werden ebenfalls dynamisch gesetzt

Auffaellig: Im SVG stehen doppelte Attribute (`viewBox`, `class`). Das ist unsauber, auch wenn der Browser oft tolerant ist.

### `client/src/shared/star-button/star-button.css`
Aktuell leer.

### `client/src/shared/delete-button/delete-button.ts`
Kleine Button-Komponente fuer Loeschen.

- `disabled` Input
- `clickEvent` Output

### `client/src/shared/delete-button/delete-button.html`
SVG-Muelltonnenbutton fuer Foto-Loeschen.

### `client/src/shared/delete-button/delete-button.css`
Aktuell leer.

### `client/src/features/lists/lists.ts`
Platzhalter fuer spaetere Listenfunktion.

### `client/src/features/lists/lists.html`
Nur Platzhaltertext.

### `client/src/features/lists/lists.css`
Aktuell leer.

### `client/src/features/messages/messages.ts`
Platzhalter fuer die Haupt-Nachrichtenseite.

### `client/src/features/messages/messages.html`
Nur Platzhaltertext.

### `client/src/features/messages/messages.css`
Aktuell leer.

### `client/src/features/test-errors/test-errors.ts`
Testkomponente fuer API-Fehler.

- `baseUrl = 'https://localhost:5001/api/'` ist hier hart codiert
- jede Methode ruft einen Fehler-Endpunkt der API auf
- `get400ValidationError()` schickt absichtlich leere Registrierungsdaten
- `validationErrors` speichert vom Interceptor geworfene Validierungsfehler

### `client/src/features/test-errors/test-errors.html`
Buttons zum Ausloesen von Fehlerfaellen.

- darunter werden Validierungsfehler als Liste gezeigt

### `client/src/features/test-errors/test-errors.css`
Aktuell leer.

### `client/src/shared/errors/not-found/not-found.ts`
Seite fuer unbekannte Ziele.

- `Location.back()` springt zur vorherigen Browser-Position

### `client/src/shared/errors/not-found/not-found.html`
Zeigt Icon, Meldung und `Go Back`.

### `client/src/shared/errors/not-found/not-found.css`
Aktuell leer.

### `client/src/shared/errors/server-error/server-error.ts`
Seite fuer 500er-Fehler.

- liest den Error aus dem Router-Navigation-State
- `showeDetails` steuert Ein-/Ausklappen der Details
- `detailsToggle()` toggelt diesen Wert

### `client/src/shared/errors/server-error/server-error.html`
Zeigt Fehlermeldung und auf Wunsch `error.details`.

### `client/src/shared/errors/server-error/server-error.css`
Aktuell leer.

## Technische Auffaelligkeiten und Lernhinweise
Diese Stellen sind besonders lehrreich, weil sie entweder wichtig oder noch nicht ganz sauber sind:

1. Neu registrierte User bekommen aktuell keinen `Member`-Datensatz. Das ist der groesste fachliche Bruch im Projekt.
2. Cloudinary-Konfiguration fehlt in `appsettings.Development.json`. Upload funktioniert nur, wenn die Werte woanders gesetzt sind.
3. Mehrere Dateinamen und Klassen sind vertippt: `Memeber`, `prevent-unsaved-chnages`, `showeDetails`, `prviewImage`. Nicht schlimm fuer die Laufzeit, aber schlecht fuer Lesbarkeit.
4. `loading-interceptor.ts` cached GETs dauerhaft und invalidiert sie nach Updates nicht. Dadurch koennen veraltete Daten im UI bleiben.
5. Mehrere RxJS-Operatoren werden ueber interne Pfade importiert. Technisch unsauber und bei Updates riskant.
6. `memeber-profile.html` hat das `Description`-Feld doppelt.
7. `test-errors.ts` nutzt eine fest codierte URL statt `environment.apiUrl`.
8. `ToastService` arbeitet direkt mit DOM-APIs. Das ist okay zum Lernen, aber in Angular oft nicht die erste Wahl.
9. Viele CSS-Dateien sind leer. Das ist normal in einem Kursprojekt, aber du solltest spaeter ungenutzte Dateien aufraeumen.
10. `WeatherForecast*` ist Template-Rest und kann spaeter entfernt werden, wenn du es nicht mehr zum Lernen brauchst.

## Empfohlene Lesereihenfolge zum Lernen
Wenn du das Projekt wirklich verstehen willst, lies in genau dieser Reihenfolge:

1. `API/Program.cs`
2. `API/Controllers/BaseApiController.cs`
3. `API/Controllers/AccountController.cs`
4. `API/Services/TokenService.cs`
5. `API/Entities/*`
6. `API/Data/AppDbContext.cs`
7. `API/Data/MemberRepository.cs`
8. `API/Controllers/MembersController.cs`
9. `client/src/main.ts`
10. `client/src/app/app.config.ts`
11. `client/src/app/app.routes.ts`
12. `client/src/core/services/account-service.ts`
13. `client/src/core/interceptors/jwt-interceptor.ts`
14. `client/src/layout/nav/*`
15. `client/src/core/services/member-service.ts`
16. `client/src/features/members/*`

So lernst du erst das Rueckgrat und dann die Details.

## Was du als naechstes ueben solltest
Wenn du das Projekt wirklich selbststaendig bauen koennen willst, dann uebe diese drei Dinge:

1. Schreibe `Register` im Backend so um, dass beim Registrieren direkt auch ein `Member` entsteht.
2. Entferne den Cache aus `loading-interceptor.ts` oder invalidiere ihn sauber nach Mutationen.
3. Implementiere die Platzhalterseiten `messages` und `lists` mit echten API-Endpunkten.

## Merksatz fuer dein ganzes Projekt
Backend:

- Controller nehmen Requests an
- Services und Repositories erledigen Logik und Datenzugriff
- Entities sind Datenbankmodelle
- DTOs sind Transportmodelle

Frontend:

- Services sprechen mit der API
- Interceptors behandeln Querschnittsthemen wie Token, Fehler und Loading
- Komponenten zeigen Daten an und sammeln Eingaben
- Router/Guards/Resolver steuern Navigation und Vorladen

Wenn du diese Trennung verstanden hast, hast du den groessten Teil des Projekts bereits verstanden.
