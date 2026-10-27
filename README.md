# AbonnementCheck — appcode

Dit is de werkende webapp-code, niet de interactieve ontwerp-preview.

## Wat werkt
- Abonnementen toevoegen, bekijken, bewerken en verwijderen
- Kosten omgerekend naar maand- en jaartotalen (week, maand, kwartaal, jaar)
- Volgende betaaldatum, startdatum en uiterste opzegdatum vastleggen
- Dashboardwaarschuwingen voor opzegdeadlines binnen 30 dagen
- Zoeken en filteren
- Vijf kleurthema's
- Lokale opslag op het apparaat
- JSON-back-up exporteren en importeren
- Responsieve interface voor mobiel en desktop

## Snel lokaal openen
Open `index.html` in een moderne browser. Voor service-worker/PWA-functies is een lokale webserver nodig.

## Op GitHub Pages zetten
Upload `index.html` en `manifest.webmanifest` naar de root van je repository. Stel GitHub Pages in op branch `main`, map `/(root)`.

## Android-app voorbereiden
Deze map bevat `package.json` en `capacitor.config.json` als startpunt voor een Android-build met Capacitor. Omdat de Capacitor `webDir` op `dist` staat, voer je vanuit deze map uit:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Installeer Android Studio en de Android SDK voordat je de Android-stappen uitvoert. In Android Studio kun je een test-APK bouwen of een ondertekende release maken. Voor publicatie in Google Play is doorgaans een Android App Bundle (AAB) nodig.

## Opslag en meldingen
Abonnementen worden op dit moment lokaal in de browser/app opgeslagen. Ze synchroniseren niet tussen apparaten. Deadlinewaarschuwingen verschijnen in de app wanneer je deze opent; er zijn nog geen echte pushmeldingen of achtergrondmeldingen. Voor die functionaliteit is een native notificatie-integratie nodig.


## Meldingen testen
1. Bouw en installeer de Android-app via Android Studio.
2. Open AbonnementCheck → Instellingen → **Meldingen inschakelen** en geef Android-toestemming.
3. Voeg een actief abonnement toe met een opzegdeadline die minstens 8 dagen in de toekomst ligt. De app plant meldingen om 09:00 uur, 7 dagen en 1 dag vóór de deadline.
4. Controleer op het toestel of meldingen voor AbonnementCheck zijn toegestaan.

Let op: Android-versies en energiebesparingsinstellingen kunnen de precieze bezorging beïnvloeden. De meldingsplanner wordt na het toevoegen/bewerken, importeren of verwijderen van abonnementen bijgewerkt. Meldingen die al in het verleden liggen worden niet ingepland.
