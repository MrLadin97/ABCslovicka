# ABC slovíčka

Anglická slovíčka pro malé děti, které ještě neumí číst. Hra má kreslené kartičky s anglickou i českou výslovností a pět her: Najdi obrázek, Pexeso, Dej opičce, Balónky a Simon says. Po každé hře přijde jako odměna náhodná minihra: pejsek, auto, motorka v kopcích, závod s kamarádem, doručovatel, motokros nebo motorka v tunelu. Za hvězdičky se dají sbírat karty a rodiče mají vlastní přehled se statistikou.

**Hrát:** https://mrladin97.github.io/ABCslovicka/

## Přidání na plochu telefonu

- **iPhone / iPad (Safari):** otevřete odkaz, klepněte na tlačítko Sdílet a zvolte „Přidat na plochu“.
- **Android (Chrome):** otevřete odkaz, v menu ⋮ zvolte „Přidat na plochu“ nebo „Nainstalovat aplikaci“.

Po prvním spuštění se hra uloží do zařízení a funguje i bez internetu.

## Co je kde

| Soubor | Obsah |
| --- | --- |
| `index.html` | Hra, databáze slovíček (`CATEGORIES`), kartičky, Najdi obrázek, minihry, sbírka, přehled pro rodiče |
| `learn.js` | Pexeso, Dej opičce, Balónky, Simon says, databáze slovíček pro rodiče |
| `pics.js` | Kreslené obrázky slovíček (SVG) |
| `cards.js` | Sběratelské karty a obrázky do miniher |
| `minigames.js` | Motorkové minihry: závod, doručovatel, motokros, tunel |
| `audio/gb`, `audio/gb-slow`, `audio/cs` | Nahrávky: anglicky, anglicky pomalu, česky |
| `sw.js` | Offline režim. Po každé změně hry zvyšte `VERSION`. |

Postup dítěte (hvězdičky, sbírka, statistika) se ukládá jen v prohlížeči daného zařízení.
