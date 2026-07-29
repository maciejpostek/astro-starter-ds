# Praktyczny audyt AI-Native Runtime V1.0

Data: 2026-07-29  
Zakres: mały audyt diagnostyczny routingu i Context Pack, 7 prób  
Konfiguracja żądana: `gpt-5.6-sol` + `high` + `Standard`  
Figma: poza zakresem

## Executive summary

Audyt wykazał, że klasyfikacja intentu jest poprawna we wszystkich 7 próbach,
ale sam route gate poprawnie dopuścił tylko 4 z 7 oczekiwanych zadań. Trzy
próby zostały fałszywie zablokowane:

- **R01**: jawne utworzenie nowego `Keycap` zostało sklasyfikowane jako
  `create`, lecz router uznał prop `label` za odwołanie do istniejącego
  komponentu `Label`. Jednocześnie nazwa `Keycap` nie została wykryta jako
  target. Creation gate zablokował więc prawidłowe żądanie.
- **R05 i R06**: negacja „nie twórz `BlogSection`” została potraktowana jak
  pozytywne żądanie brakującego komponentu. Obie kompozycje dostały poprawny
  intent `compose`, ale błędny status `blocked`.

Czysta próba kompozycji bez nazwanej negacji (**R07**) przeszła routing i
rozwiązała właściwe komponenty oraz bezpośrednie zależności. Obie próby
exact-edit (**R03**, **R04**) przeszły najkrótszą ścieżką foundations-only,
bez registry, family rules, Brand Contract, Figma i full build. Reuse
`ArticleCard.Compact` (**R02**) również przeszedł, choć Context Pack nie zawiera
przygotowanego pliku docelowej strony ani źródeł zależności zapisanych w
rekordzie komponentu.

Wszystkie deskryptory Context Pack zmieściły się w limitach. Mediana
bezmodelowej decyzji route + contract + context wyniosła **2,97 ms**, a
obserwowane p95 **6,73 ms**. Przy 7 próbach p95 jest wyłącznie diagnostyczne.

Automatyczne wykonanie modelowe nie zostało uruchomione. Capability gate
wykazał, że lokalny `codex exec` 0.141.0 nie udostępnia aliasu
`gpt-5.6-sol`. Nie podstawiono innego modelu i nie obchodzono gate. Z tego
powodu model wall time, TTFA, model tool calls, rzeczywiste model-visible read
bytes, forbidden/unnecessary reads, terminal quality oraz token usage są
oznaczone jako **unavailable**, a nie estymowane.

## Konfiguracja i capability gate

| Pole | Requested | Effective | Provenance |
|---|---|---|---|
| Model | `gpt-5.6-sol` | unavailable | requested: konfiguracja tasku; effective: brak model events |
| Reasoning | `high` | unavailable | requested: konfiguracja tasku; effective: brak model events |
| Speed | `Standard` | unavailable | requested: konfiguracja tasku; effective: brak model events |
| CLI | — | `codex-cli 0.141.0` | measured |
| JSON / ephemeral / output schema | — | dostępne | measured |

Katalog lokalnego CLI zawierał: `gpt-5.5`, `gpt-5.4`, `gpt-5.4-mini`,
`gpt-5.3-codex`, `gpt-5.2`, `codex-auto-review`. Nie zawierał Sol, Terra ani
Luna. Wynik capability gate: `failed`.

Pojedyncza komenda harnessu `run` nie egzekwuje tego gate, dlatego nie została
użyta. Zastąpienie Sol modelem o innym slugu unieważniłoby kohortę.

## Metoda

1. Odczytano instrukcje repozytorium, `AGENTIC-RULES.json`, kanoniczną mapę
   systemu oraz istniejący harness.
2. Potwierdzono, że `Keycap` nie istnieje w source, registry ani Guides.
3. Każdy run dostał świeży workspace w `/tmp`, kopię bieżącego dirty snapshotu,
   własny baseline commit i deterministyczny fixture.
4. Próby wykonano sekwencyjnie.
5. Dla każdej próby uruchomiono bezmodelowo:
   `routeAgentRequest`, walidację task contract oraz
   `resolveAgentContext`.
6. Fixture był częścią baseline izolowanego workspace. Dlatego `changed files`,
   diff i registry delta mierzą wyłącznie zmiany po routingu, nie sam seed.
7. Workspace’y usunięto po pomiarze.

Nie uruchomiono 44-runowego pilota ani adaptacyjnego cross-productu.

## Tabela runów — routing

| ID | Scenariusz | Expected intent | Router intent | Route status | Targety | `allowNewComponents` | Brand mode |
|---|---|---:|---:|---|---|---:|---|
| R01 | CREATE `Keycap` | create | create | **blocked** | błędnie `Label` existing; brak `Keycap` | true | required |
| R02 | REUSE `ArticleCard.Compact` | reuse | reuse | ready | `ArticleCard` existing | false | skip |
| R03 | EXACT primitive hex | exact-edit | exact-edit | ready | `--color-accent-500` existing | false | skip |
| R04 | EXACT Button color alias | exact-edit | exact-edit | ready | `--button-primary-background-hover`, `--color-accent-700` existing | false | skip |
| R05 | COMPOSE editorial z negacją | compose | compose | **blocked** | trzy istniejące komponenty + błędny missing `BlogSection` | false | approved-only |
| R06 | CONTROL „nie twórz BlogSection” | compose | compose | **blocked** | dwa istniejące komponenty + błędny missing `BlogSection` | false | approved-only |
| R07 | COMPOSE editorial bez nazwanej negacji | compose | compose | ready | `SectionHeader`, `ArticleCard`, `SwiperStarter`, page, section | false | approved-only |

Blocked reasons:

- **R01**: `The requested component already exists: Label.`
- **R05, R06**: `Missing reusable component: BlogSection. No new component was authorized.`

## Confusion matrix

### Expected intent → router intent

| Expected \ Actual | exact-edit | reuse | compose | create |
|---|---:|---:|---:|---:|
| exact-edit | 2 | 0 | 0 | 0 |
| reuse | 0 | 1 | 0 | 0 |
| compose | 0 | 0 | 3 | 0 |
| create | 0 | 0 | 0 | 1 |

Intent accuracy: **7/7 (100%)**.

### Oczekiwane dopuszczenie → route status

Wszystkie 7 naturalnych promptów miało wystarczające wejście do rozpoczęcia
zadania.

| Expected | ready | blocked |
|---|---:|---:|
| ready | 4 | 3 |

Ready accuracy: **4/7 (57,1%)**. False-blocked rate: **3/7 (42,9%)**.

## Context Pack per scenariusz

| ID | Descriptor / limit | Declared source bytes | Required reads | Wykryte zależności | Validator |
|---|---:|---:|---|---|---|
| R01 | 1 209 / 102 400 B | 26 401 B | błędny source `Label`; framework; components rule | brak | component-creation |
| R02 | 1 573 / 12 288 B | 9 297 B | source `ArticleCard` | rekord wymienia `MediaRatio`, `Tag`, ale resolver ich nie materializuje w reuse | component-use |
| R03 | 562 / 4 096 B | 2 784 B | `color-primitives.css` | brak | token |
| R04 | 942 / 4 096 B | 10 859 B | `color-components.css`, `color-primitives.css` | alias primitive `--color-accent-700` | token |
| R05 | 4 781 / 40 960 B | 30 141 B | 3 komponenty + 4 direct dependencies | `Eyebrow`, `MediaRatio`, `Tag`, `IconButton` | page-composition |
| R06 | 3 645 / 40 960 B | 18 164 B | 2 komponenty + 3 direct dependencies | `Eyebrow`, `MediaRatio`, `Tag` | page-composition |
| R07 | 4 294 / 40 960 B | 30 141 B | 3 komponenty + 4 direct dependencies | `Eyebrow`, `MediaRatio`, `Tag`, `IconButton` | page-composition |

Łącznie: 17 006 B deskryptorów i 127 787 B zadeklarowanych źródeł. Nie było
przekroczenia limitu deskryptora.

### Szczegóły required reads

- **R01**:
  `src/components/atoms/forms/Label.astro`,
  `.agentic-rules/00-framework.md`,
  `.agentic-rules/05-components.md`.
- **R02**:
  `src/components/molecules/cards/ArticleCard.astro`.
- **R03**:
  `src/styles/tokens/color-primitives.css`.
- **R04**:
  `src/styles/tokens/color-components.css`,
  `src/styles/tokens/color-primitives.css`.
- **R05 i R07**:
  `SectionHeader.astro`, `ArticleCard.astro`, `SwiperStarter.astro`,
  `Eyebrow.astro`, `MediaRatio.astro`, `Tag.astro`, `IconButton.astro`.
- **R06**:
  `SectionHeader.astro`, `ArticleCard.astro`, `Eyebrow.astro`,
  `MediaRatio.astro`, `Tag.astro`.

### Ocena Context Pack

- **R03** jest wzorcową ścieżką tiny: jedna definicja primitive, foundations-only
  i właściwy validator.
- **R04** nadal pozostaje foundations-only i prawidłowo obejmuje zarówno
  component color variable, jak i wskazany primitive alias. Deskryptor ma
  942 B, ale zadeklarowane źródła mają 10 859 B. To nie łamie obecnej
  implementacji, ponieważ limit dotyczy wyłącznie serializowanego deskryptora.
  Raportowanie powinno nadal pokazywać oba wymiary.
- **R02** ma mały descriptor, ale przygotowany plik strony nie jest targetem ani
  required read. Prompt celowo nie ujawnia ścieżki benchmarkowej, więc agent
  musiałby wykonać dodatkowe discovery. `MediaRatio` i `Tag` są obecne w
  rekordzie `ArticleCard`, lecz resolver materializuje direct dependencies
  tylko dla `compose`.
- **R07** prawidłowo rozwiązuje named components, ich direct dependencies i
  compact composition contract. Nie ładuje pełnego registry, sections rule,
  creation rules ani Figma.
- **R01** nie zawiera dowodu luki dla `Keycap`, właściwej reguły rodziny text
  ani targetu `Keycap`, ponieważ błąd ekstrakcji targetu następuje przed
  rozwiązaniem kontekstu. Approved Brand Contract był obecny w fixture, ale
  blokada pochodziła z creation gate, nie z brand gate.

## False positive i false blocked

### Pomylenie targetu utworzenia z propem — R01

Router wyszukuje aliasy istniejących komponentów w całym promptcie bez ról
semantycznych i bez rozróżnienia wielkości liter. Wymagany prop `label`
dopasował więc publiczny komponent `Label`.

Jednocześnie ogólny wzorzec kandydatów rozpoznaje tylko nazwy zakończone
ograniczoną listą sufiksów, takich jak `Card`, `Button`, `Label` czy `Section`.
`Keycap` nie pasuje do tej listy. Rezultat to:

- intent `create` — poprawny;
- target `Label` — false positive;
- target `Keycap` — false negative;
- status `blocked` — false blocked.

### Brak obsługi negacji — R05, R06

Ekstrakcja kandydatów rozpoznaje `BlogSection`, ale nie uwzględnia operatora
„nie twórz”. Missing target przechodzi więc do creation gate jak pozytywna
zależność. R07 potwierdza, że po usunięciu samej nazwanej negacji identyczny
rodzaj kompozycji ma status `ready`.

### R04 — target główny i wartość aliasu

Router zapisuje jako targety zarówno zmienianą variable
`--button-primary-background-hover`, jak i variable używaną w oczekiwanej
wartości `--color-accent-700`. Nie powoduje to blokady i daje prawidłowy
foundations context, ale drugi token pełni rolę zależności/wartości, a nie
drugiego edytowanego targetu. Rozróżnienie tych ról poprawiłoby telemetry.

Nie wykryto unsafe false-ready w tej próbie. Wynik nie jest statystyczną oceną
całego routera.

## Czas, narzędzia i tokeny

### Pomiary bezmodelowe

| ID | Setup fixture | Route + contract + context | Model wall | TTFA |
|---|---:|---:|---:|---:|
| R01 | 666,09 ms | 6,61 ms | unavailable | unavailable |
| R02 | 565,12 ms | 5,05 ms | unavailable | unavailable |
| R03 | 601,20 ms | 1,17 ms | unavailable | unavailable |
| R04 | 605,04 ms | 1,40 ms | unavailable | unavailable |
| R05 | 549,32 ms | 2,97 ms | unavailable | unavailable |
| R06 | 549,86 ms | 1,78 ms | unavailable | unavailable |
| R07 | 546,87 ms | 6,73 ms | unavailable | unavailable |

- Setup fixture: mediana 565,12 ms; łącznie 4 083,50 ms.
- B0 decision: mediana 2,97 ms; min 1,17 ms; obserwowane p95/max 6,73 ms;
  łącznie 25,69 ms.
- Łączny zmierzony czas setup + B0 decision: 4 109,19 ms.
- Każdy run wykonał po jednym wywołaniu routera, walidatora task contract i
  resolvera kontekstu.
- Model tool calls: unavailable.
- Validator calls wewnątrz runów: 0, measured-B0. Context Pack zadeklarował
  właściwe scope’y walidacji, ale bez mutacji modelowej nie było czego
  walidować.

### Token usage i koszt

| Rodzaj | Wartość | Provenance |
|---|---:|---|
| Input tokens | null | unavailable |
| Output tokens | null | unavailable |
| Cached tokens | null | unavailable |
| Reasoning tokens | null | unavailable |
| Total tokens | null | unavailable |
| Koszt modelowy | null | unavailable |

Nie zastosowano byte-to-token proxy. Cached i reasoning tokens nie były
zgadywane.

### Rzeczywiste odczyty modelu

Actual model-visible read bytes, unnecessary reads i forbidden reads są
**unavailable**, ponieważ nie powstały model events. Required reads i declared
source bytes są pomiarami resolvera, nie dowodem, że model rzeczywiście
odczytał pliki.

Istniejący harness nazywa `actual_model_read_bytes` sumę outputów narzędzi
widocznych w eventach. Jest to użyteczny event-output proxy, ale nie ścisły
licznik bajtów source-file reads.

## Terminal, zmiany i jakość

| ID | Expected terminal | Actual model terminal | Changed files | Diff | Registry delta | Jakość modelowa |
|---|---|---|---:|---:|---:|---|
| R01 | accepted; source + registry + Guides; registry > 0 | not-run-capability-gate | 0 | 0 B | 0 | unavailable |
| R02 | accepted; registry 0 | not-run-capability-gate | 0 | 0 B | 0 | unavailable |
| R03 | accepted; registry 0 | not-run-capability-gate | 0 | 0 B | 0 | unavailable |
| R04 | accepted; registry 0 | not-run-capability-gate | 0 | 0 B | 0 | unavailable |
| R05 | accepted; registry 0 | not-run-capability-gate | 0 | 0 B | 0 | unavailable |
| R06 | accepted; registry 0 | not-run-capability-gate | 0 | 0 B | 0 | unavailable |
| R07 | accepted; registry 0 | not-run-capability-gate | 0 | 0 B | 0 | unavailable |

Zerowy registry delta w R01 nie jest wynikiem wykonania zadania create:
modelowa część została zatrzymana. Natomiast route gate już na etapie B0
błędnie zablokowałby to wykonanie.

## Safety results

- Source, registry i Guides nie zawierały `Keycap` przed fixture.
- Creation fixture miał `status: approved` w Brand Contract.
- Hash dirty snapshotu przed próbami i po wszystkich 7 próbach, po wyłączeniu
  jedynego dodanego pliku raportu:
  `988130250debffe0ca06cd6117a6896cb3ff5feb7206f0e8947c61c79e3096ae`.
  Snapshot pozostał bez zmian.
- Wszystkie zmiany fixture były izolowane i commitowane jako baseline przed
  pomiarem.
- Nie wykonano operacji Figma; wszystkie Context Pack miały Figma w
  `skippedContexts`.
- Nie wykonano modelu o zastępczym slugu.
- Nie wdrożono zmian Runtime, komponentów, tokenów, registry, Guides ani
  architektury.

Dodatkowe walidacje repozytorium:

- `test:agent-runtime`: 9/9 passed;
- `audit:agent-runtime`: passed, 5 wbudowanych routing scenarios;
- `test:runtime-benchmark`: 14/14 passed, w tym wszystkie fixture’y.

To, że walidatory przechodzą mimo R01/R05/R06, wskazuje lukę w pokryciu
regresyjnym, a nie sprzeczność wyników.

## Ograniczenia harnessu istotne dla interpretacji

1. `routing.actual_intent` w run record jest wyliczane jako
   `terminal.intent ?? task.intent`; terminal modelu może więc zamaskować surowy
   wynik routera. Surowy intent jest dostępny w evencie `route_end`.
2. Standardowy run record nie zachowuje `task.targets`, `blockedReason`,
   pełnego `requiredReads`, `context.dependencies` ani `context.missing`.
   Niniejszy audyt zebrał je dodatkowym fixture-aware B0 collector.
3. `git diff` nie obejmuje nowych untracked files. `diff_size_bytes` może przez
   to zaniżać wynik create, nawet gdy `changed_files` wykryje nowy plik.
4. Read classification opiera się na ścieżkach znalezionych w komendach.
   Directory-wide discovery i odczyty poza tym kanałem mogą zostać pominięte.
5. Capability gate jest egzekwowany przez przygotowanie/adaptive workflow, ale
   bezpośrednie `run` i `pilot` mogą go ominąć.

## Rekomendacje

### P0

1. **Rozdziel role nazw w create i nie ograniczaj targetu do whitelisty
   sufiksów.** Jawnie wydobądź nazwę nowego publicznego komponentu, osobno
   wspierające komponenty, props i tokeny. Dodaj regresję `Keycap` + prop
   `label`. Dowód: **R01**.
2. **Dodaj negation-aware candidate filtering** dla konstrukcji typu
   „nie twórz X”, „bez X”, „do not create X”. Nazwa w negacji nie może stać się
   required/missing targetem. Dowód: **R05, R06**, kontrola pozytywna **R07**.
3. **Egzekwuj capability gate także w bezpośrednich komendach modelowych**
   `run` i `pilot`, przynajmniej dla żądanego cohortu. Obecnie można ominąć
   preflight i wysłać niedostępny alias.

### P1

1. Dodaj do testów runtime i małego manifestu diagnostycznego dokładnie:
   public create z nazwą bez obsługiwanego sufiksu, negację brakującego
   komponentu, primitive hex exact-edit i component-color alias exact-edit.
   Dowód: **R01, R03, R04, R05, R06**.
2. Po naprawie ekstrakcji create dopilnuj, aby Context Pack zawierał właściwą
   family rule, gap evidence oraz adekwatny approved Brand Contract/rules.
   Obecny R01 kończy z ogólną regułą components i błędnym `Label`.
3. W named reuse przekaż jawny target file z warstwy wywołującej albo dodaj
   kontrolowane discovery. Obecny pack R02 zna API `ArticleCard`, ale nie zna
   przygotowanej strony.
4. Zapisuj w run record surowe pola routera i resolvera: router intent,
   targets, blocked reason, required reads, dependencies, missing i
   terminal missing input.
5. Rozróżnij primary edit targets od referenced-value dependencies. W R04
   `--color-accent-700` jest wartością aliasu, nie drugim edytowanym tokenem.

### P2

1. Raportuj obok descriptor budget również declared/materialized source bytes.
   R04 ma 942 B deskryptora i 10 859 B zadeklarowanych źródeł.
2. Zastąp lub uzupełnij event-output proxy precyzyjnym licznikiem odczytów
   plików, z deduplikacją i rozpoznaniem directory reads.
3. Generuj diff uwzględniający nowe untracked files, szczególnie dla create.
4. Rozdziel cohort-specific capability od globalnego wymagania dostępności
   Sol, Terra i Luna. Mały audyt Sol powinien raportować dokładnie gate Sol,
   choć w tym przypadku sam Sol również był niedostępny.

## Decyzja

Runtime V1.0 jest szybki i oszczędny dla badanych exact-edit, reuse i czystej
kompozycji, ale nie powinien jeszcze uzyskać pełnego „pass” dla naturalnego
routingu create/compose. Najpierw należy naprawić P0 z R01/R05/R06 i dodać
regresje. Rekomendowane zmiany nie zostały wdrożone; wymagają osobnej zgody.
