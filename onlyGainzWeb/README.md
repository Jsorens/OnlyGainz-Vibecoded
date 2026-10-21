# OnlyGainz Web

OnlyGainz Web er en enkel webapp for å loggføre måltider og se kalorier og makronæringsstoffer (protein, karbohydrater og fett) per dag. Appen er bygget med React og TypeScript på [RedwoodSDK](https://docs.rwsdk.com/), og kjører på Cloudflare Workers.

## Slik starter du applikasjonen

### Du trenger

- [Node.js](https://nodejs.org) (en nyere versjon, helst 22 eller nyere)
- [pnpm](https://pnpm.io). Du installerer det med `npm install -g pnpm`.
- Internett, siden matvarene hentes fra Matvaretabellen. Konto hos Cloudflare trengs ikke.

### Steg

1. Last ned prosjektet og åpne en terminal i prosjektmappen (`onlyGainzWeb`).
2. Installer avhengighetene:

   pnpm install

3. Start utviklingsserveren:

   pnpm dev

4. Åpne adressen som vises i terminalen i nettleseren. Den er vanligvis `http://localhost:5173`.

## Slik bruker du appen

1. Søk etter en matvare og velg den i nedtrekksmenyen.
2. Skriv inn mengde i gram, eller bruk en av hurtigknappene.
3. Velg måltidstype og trykk **Legg til**.
4. Dagsoversikten øverst viser kalorier og makroer. Bruk datovelgeren eller pilene for å se andre dager.

## Gode å vite

- Måltidene lagres i filen `src/features/storage/meals.json`. Det skjer bare under `pnpm dev`, og ikke i produksjon.
- Hvis Matvaretabellen ikke kan nås, brukes en liten lokal liste (`src/features/storage/foods.json`) i stedet, og du får en advarsel i terminalen.
- Etter at du har endret `meals.json` for hånd, må du stoppe serveren (Ctrl+C) og starte den på nytt med `pnpm dev`.
- Typekontroll kjører du med `pnpm types`.

## Further Reading

- [RedwoodSDK Documentation](https://docs.rwsdk.com/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers)
