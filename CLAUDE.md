# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sovelluksen kuvaus

Dosetti on yksinkertainen PWA-lääkemuistutussovellus. Käyttäjä merkitsee päivittäisen lääkkeen otetuksi, sovellus laskee peräkkäisen putken (streak) ja näyttää konfetti-animaation onnistuneesta kirjauksesta.

## Rakenne

Ei erillistä build-vaihetta — kaikki koodi on suoraan tiedostoissa:

- `index.html` — koko sovellus: CSS, HTML-rakenne ja JavaScript yhdessä tiedostossa
- `sw.js` — service worker: välimuististrategia (network first)
- `manifest.json` — PWA-manifest
- `icon-192.png`, `icon-512.png` — sovellusikonit

## Tietorakenne (localStorage)

Avain `dosetti_v2`, arvo JSON-objekti:
```
{
  "2026-04-10": true,
  "2026-04-10_time": "08:30",
  ...
}
```

## Tärkeät yksityiskohdat

**Service worker** käyttää network-first-strategiaa (hae aina ensin verkosta ja päivitä välimuisti, välimuisti fallbackina offline-tilassa). Jos sw.js päivitetään, muista vaihtaa versioitu välimuistin nimi (nyt `dosetti-v3`).

**Streak-laskenta** (`calcStreak`): Jos tänään ei ole vielä otettu, lasketaan eilen alkavasta päivästä taaksepäin. Näin streak ei katkea ennen kuin päivä on ohi.

**Badge API** (`navigator.setAppBadge`): Asettaa 1 kun lääke on ottamatta, tyhjentää kun otettu. Badge päivitetään sivun puolella: latauksessa, puoliyön ajastimella (kun sovellus on auki) ja `visibilitychange`-tapahtumassa kun sovellus palaa esiin. Service workerissa ei ole badge-ajastusta — selain sammuttaa joutilaan service workerin, joten pitkä `setTimeout` ei toimi siellä.

**Sovellus julkaistaan GitHub Pagesilta** — käytä aina suhteellisia polkuja (`./` eikä `/`).
