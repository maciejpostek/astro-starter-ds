# Runtime V1.1 — raport before/after

Data: 2026-07-29  
Snapshot before: `951b188` na `codex/before-1.1`  
Implementacja: `codex/runtime-1.1`  
Zakres release gate: routing i Context Pack, bez porównywania modeli  
Figma: poza zakresem wykonawczym

## Executive summary

Runtime V1.1 przeszedł 30/30 sekwencyjnych prób w świeżych fixture’ach.
Uzyskano 100% zgodności intentu, terminal statusu, ról targetów, constraints i
polityki required reads. Nie wystąpił false-ready, false-blocked ani forbidden
read. Warm route + context p95 wyniósł 6,89 ms przy limicie 50 ms, a
cold-process p95 64,86 ms przy limicie 250 ms.

Naprawiono problemy wykryte w audycie V1.0:

- `label` nie jest już mylony z komponentem `Label`; `Keycap` jest primary
  targetem create (D16);
- `Avatar`, `SectionHeader`, `ArticleCard` i `Carousel` są dependencies create,
  a nie konkurencyjnymi primary targets (D17–D18);
- polska i angielska negacja `BlogSection` są constraints, a nie missing
  targets (D29–D30);
- named reuse nie zmienia się w compose przez negowane „do not create”
  (D04–D06);
- missing positive target nadal blokuje compose (D19), a istniejący `Button`
  nadal blokuje create (D20);
- exact-edit materializuje wyłącznie definicje i referenced aliases, dzięki
  czemu primitive hex oraz Button alias mieszczą się w limicie 16 KiB
  (D27–D28);
- reuse otrzymuje przygotowany `targetFile` bez ujawniania ścieżki w promptcie
  (D04–D06);
- create jest dwufazowy: planning, następnie family resolution ograniczone do
  family rule i zadeklarowanych projekcji (D16–D18).

Tokeny modelu, cached tokens i reasoning tokens są oznaczone jako
`unavailable`. Nie są estymowane i nie stanowią release gate.

## Before/after R01–R07

| Problem V1.0 | Before | Dowód V1.1 | After |
|---|---|---|---|
| R01 `Keycap` + prop `label` | false-blocked; target `Label` | D16 | create ready; primary `Keycap`; brak `Label` |
| R02 reuse `ArticleCard.Compact` | brak pliku strony w Context Pack | D05 | source + `targetFile`; bez family/brand/dependency sources |
| R03 primitive hex | foundations-only, ale koszt liczony całym plikiem | D27 | 28 B materializowanych definicji; limit 16 KiB |
| R04 Button color alias | foundations-only, koszt 10 859 B całych plików | D28 | 208 B definicji i aliasów; bez raw-value drift context |
| R05 compose z negacją | false-blocked przez missing `BlogSection` | D29 | compose accepted; `BlogSection` tylko w constraints |
| R06 control z negacją | false-blocked przez missing `BlogSection` | D30 | compose accepted; zero missing target |
| R07 named compose | poprawny, ale bez `targetFile` | D08 | komponenty, direct dependencies, layout contract i `targetFile` |

## Macierz 30 runów

| ID | Scenariusz | Expected | Router | Route / terminal | Targety | Descriptor B | Source B | Wynik |
|---|---|---|---|---|---|---:|---:|---|
| D01 | exact-edit-small | exact-edit | exact-edit | ready / accepted | token + alias + file context | 1814 / 4096 | 192 / 16384 | pass |
| D02 | exact-edit-medium | exact-edit | exact-edit | ready / accepted | 2 tokeny + file context | 1218 / 4096 | 78 / 16384 | pass |
| D03 | exact-edit-large | exact-edit | exact-edit | ready / accepted | 3 tokeny + file context | 2229 / 4096 | 272 / 16384 | pass |
| D04 | reuse-small | reuse | reuse | ready / accepted | Button primary + file context | 2391 / 12288 | 8644 / 65536 | pass |
| D05 | reuse-medium | reuse | reuse | ready / accepted | ArticleCard primary + file context | 2210 / 12288 | 9504 / 65536 | pass |
| D06 | reuse-large | reuse | reuse | ready / accepted | SwiperStarter primary + file context | 1948 / 12288 | 7470 / 65536 | pass |
| D07 | compose-small | compose | compose | ready / accepted | 2 primary + scopes + file | 3977 / 40960 | 11911 / 262144 | pass |
| D08 | compose-medium | compose | compose | ready / accepted | 3 primary + scopes + file | 5767 / 40960 | 30786 / 262144 | pass |
| D09 | compose-large | compose | compose | ready / accepted | 3 primary + page + file | 5750 / 40960 | 30579 / 262144 | pass |
| D10 | repair-small | repair | repair | ready / accepted | Button primary + file context | 2314 / 12288 | 26406 / 196608 | pass |
| D11 | repair-medium | repair | repair | ready / accepted | ArticleCard primary + file context | 2659 / 12288 | 34079 / 196608 | pass |
| D12 | repair-large | repair | repair | ready / accepted | SwiperStarter primary + file | 2153 / 12288 | 25820 / 196608 | pass |
| D13 | extend-small | extend | extend | ready / accepted | SectionHeader primary + file | 2214 / 102400 | 404851 / 524288 | pass |
| D14 | extend-medium | extend | extend | ready / accepted | ArticleCard primary + file | 2564 / 102400 | 427114 / 524288 | pass |
| D15 | extend-large | extend | extend | ready / accepted | SwiperStarter primary + file | 2307 / 102400 | 419886 / 524288 | pass |
| D16 | create-small | create | create | ready / accepted | Keycap primary | 1459 / 102400 | 224436 / 786432 | pass |
| D17 | create-medium | create | create | ready / accepted | AuthorByline primary; Avatar dependency | 2731 / 102400 | 226944 / 786432 | pass |
| D18 | create-large | create | create | ready / accepted | section primary; 3 dependencies | 5756 / 102400 | 252686 / 786432 | pass |
| D19 | missing component | compose | compose | blocked / blocked | missing primary + page context | 1435 / 40960 | 0 / 262144 | pass |
| D20 | existing component create | create | create | blocked / blocked | Button primary existing | 2698 / 102400 | 224436 / 786432 | pass |
| D21 | missing token | exact-edit | exact-edit | blocked / blocked | missing token primary | 745 / 4096 | 0 / 16384 | pass |
| D22 | brand not configured | compose | compose | ready / blocked | page context | 908 / 40960 | 0 / 262144 | pass |
| D23 | approved brand filter | compose | compose | ready / accepted | SectionHeader primary | 2676 / 40960 | 4551 / 262144 | pass |
| D24 | no default Figma | reuse | reuse | ready / accepted | Button primary | 2139 / 12288 | 8437 / 65536 | pass |
| D25 | explicit Figma routing-only | reuse | reuse | ready / accepted | Button primary | 2139 / 12288 | 8437 / 65536 | pass |
| D26 | Figma not validator | reuse | reuse | ready / accepted | Button primary | 2139 / 12288 | 8437 / 65536 | pass |
| D27 | primitive hex | exact-edit | exact-edit | ready / accepted | primitive primary + file | 944 / 4096 | 28 / 16384 | pass |
| D28 | component color alias | exact-edit | exact-edit | ready / accepted | component token + alias + file | 2010 / 4096 | 208 / 16384 | pass |
| D29 | polska negacja | compose | compose | ready / accepted | 3 primary + scopes + file | 5755 / 40960 | 30289 / 262144 | pass |
| D30 | angielska negacja | compose | compose | ready / accepted | 3 primary + scopes + file | 5755 / 40960 | 30289 / 262144 | pass |

## Confusion matrix

### Expected intent → router intent

| Expected \ Actual | exact-edit | reuse | compose | repair | extend | create |
|---|---:|---:|---:|---:|---:|---:|
| exact-edit | 6 | 0 | 0 | 0 | 0 | 0 |
| reuse | 0 | 6 | 0 | 0 | 0 | 0 |
| compose | 0 | 0 | 8 | 0 | 0 | 0 |
| repair | 0 | 0 | 0 | 3 | 0 | 0 |
| extend | 0 | 0 | 0 | 0 | 3 | 0 |
| create | 0 | 0 | 0 | 0 | 0 | 4 |

Intent accuracy: 30/30.

### Expected terminal → actual terminal

| Expected \ Actual | accepted | blocked |
|---|---:|---:|
| accepted | 26 | 0 |
| blocked | 0 | 4 |

Terminal accuracy: 30/30. False-ready: 0. False-blocked: 0.

## Context Pack per flow

| Flow | Runy | Maks. descriptor | Maks. materialized source | Limit source | Polityka |
|---|---:|---:|---:|---:|---|
| exact-edit | 6 | 2229 B | 272 B | 16 KiB | definitions + referenced aliases |
| reuse | 6 | 2391 B | 9504 B | 64 KiB | record/API + source + targetFile |
| compose | 8 | 5767 B | 30786 B | 256 KiB | named sources + direct deps + targetFile + matching brand |
| repair | 3 | 2659 B | 34079 B | 192 KiB | source + direct deps + family rule |
| extend | 3 | 2564 B | 427114 B | 512 KiB | source/API + family/category + registry/Guides |
| create | 4 | 5756 B | 252686 B | 768 KiB | phase 1 planning; phase 2 family/projections |

Łącznie deskryptory miały 80 804 B, a zadeklarowane materializowane źródła
2 456 770 B. Największy pojedynczy Context Pack nadal mieścił się w obu
limitach.

Create phase 2:

- D16: `text.md` + registry + Components Guides, 389 873 B;
- D17: `content.md` + registry + Components Guides, 394 343 B;
- D18: `sections.md` + registry + Sections Guides, 577 245 B.

## Safety results

- D19: pozytywnie wymagany brakujący komponent pozostaje blocked.
- D20: istniejącego `Button` nie można utworzyć ponownie.
- D21: brakujący token pozostaje blocked.
- D22: open-ended brand composition bez approved contract pozostaje blocked.
- D23: materializowana jest wyłącznie pasująca approved brand rule.
- D24–D26: żaden Context Pack nie zawiera ścieżki Figma; Figma nie jest
  domyślnym walidatorem.
- D27–D28: exact-edit nie czyta registry, family rules ani brandu.
- D29–D30: negacje nie tworzą missing targets.
- Wszystkie runy: registry delta 0, changed files 0 i diff 0, ponieważ gate
  ocenia routing/context na fixture baseline bez uruchamiania wykonawcy.

## Czas i tokeny

| Metryka | Wynik | Provenance |
|---|---:|---|
| warm route + context p95 | 6,89 ms | measured |
| cold-process p95 | 64,86 ms | measured |
| limit warm | < 50 ms | release criterion |
| limit cold | < 250 ms | release criterion |
| model wall / TTFA | unavailable | brak model call |
| input/output tokens | unavailable | brak model telemetry |
| cached/reasoning tokens | unavailable | brak model telemetry |
| koszt dostawcy | unavailable | brak model telemetry i rate gate |

Koszt kontekstu jest raportowany w bajtach model-visible read plan, bez
zgadywania tokenizacji dostawcy.

## Priorytety po V1.1

### P0 — zamknięte w V1.1

- role-aware target extraction i osobne constraints (D16–D18, D29–D30);
- exact-match creation primary zamiast fuzzy prefix collision (D18);
- bezpieczny `targetFile` i minimalny reuse Context Pack (D04–D06);
- kontrolowany materialized-source budget per flow (D01–D30);
- dwufazowy create Context Pack (D16–D18);
- deterministyczny release gate niezależny od model capability (D01–D30).

### P1 — dalsze utwardzenie bez zmiany architektury

- egzekwować, aby konsument Context Pack materializował dokładnie byte-counted
  token snippets wskazane przez `readPlan`, a nie ponownie pełne pliki
  (szczególnie D03, D27, D28);
- rozszerzyć istniejący test controlled source-budget block z exact-edit na
  pozostałe pięć flow;
- utrzymać regression prompts dla zagnieżdżonych negacji i wielojęzycznych
  odmian czasowników.

### P2 — opcjonalne diagnostyki

- dodać pojedyncze modelowe smoke tests dopiero po udostępnieniu stabilnego
  aliasu modelu; nie włączać ich do release gate;
- mierzyć actual model-visible bytes i provider tokens wyłącznie z provenance
  `measured`; cached/reasoning pozostawiać `unavailable`, gdy events ich nie
  ujawniają.

Żadna rekomendacja P1/P2 nie została automatycznie wdrożona jako osobna zmiana
architektury.
