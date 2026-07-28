# Benchmark Align UI i rekomendacje dla biblioteki MPCOM

Status: zweryfikowany benchmark read-only  
Data audytu: 2026-07-25  
Zakres zmian: wyłącznie ten raport i wpis w routerze reguł

## 1. Executive summary

**Obserwacja.** Align UI ma 95 stron, 6 kolekcji i 376 Variables. Zawiera
34 Text Styles, 27 Effect Styles, 37 Paint Styles i 4 Grid Styles. Pełny skan
wykazał 258 Component Sets, 4 342 samodzielne mastery, 4 922 warianty,
49 736 instancji, 40 sekcji, 59 672 frame'y i 20 022 raw frames według
definicji z sekcji 2.

**Obserwacja.** MPCOM ma 26 stron ogółem, z czego 12 to strony rodzin
komponentów. Ma 9 kolekcji, 383 Variables, 23 Text Styles, 2 Effect Styles,
0 Paint Styles i 1 Grid Style. Audyt architektury kodu przechodzi z wynikiem
66 publicznych plików, 66 publicznych rekordów i 76 rekordów łącznie.

**Interpretacja.** Największą wartością Align UI nie jest liczba wariantów,
lecz szerokość materiału projektowego: spójna nawigacja po pliku, strony
overview/guidelines/examples, gotowe produkty i duży katalog sekcji. Największe
ryzyka to eksplozja wariantów, brak opisów komponentów i Variables, brak Web
code syntax oraz słabe powiązanie spacingu, gapów i grubości obramowań
z tokenami.

**Rekomendacja.** MPCOM powinien zachować code-first kontrakt 66 komponentów,
silne opisy i Web code syntax, a z Align UI zaadaptować warstwę dokumentacji,
przykładów i kompozycji. Nie należy kopiować jego API, pełnych macierzy
wariantów ani desktop/mobile jako automatycznie zduplikowanych komponentów.

### Zweryfikowane statystyki

| Metryka | Align UI | MPCOM |
| --- | ---: | ---: |
| Wszystkie strony | 95 | 26 |
| Strony rodzin komponentów | 40 szczegółowych stron Base Components | 12 |
| Kolekcje Variables | 6 | 9 |
| Variables | 376 | 383 |
| Przypisania variable–mode | 564 | 679 |
| Aliasy | 328 (58,16%) | 433 (63,77%) |
| Variables z `ALL_SCOPES` | 351 | 0 |
| Variables z pustym scopes | 0 | 97 |
| Variables bez Web code syntax | 376 | 1 kontrolowany wyjątek |
| Variables z opisem | 0 | 382 |
| Text Styles | 34 | 23 |
| Effect Styles | 27 | 2 |
| Paint Styles | 37 | 0 |
| Grid Styles | 4 | 1 |
| Publiczne komponenty w kodzie | nie dotyczy | 66 |

## 2. Metoda, definicje i ograniczenia

**Obserwacja.** Audyt wykonano wyłącznie za pomocą odczytowych operacji Figma:
odczytu metadanych, screenshotów i skryptów Plugin API, które nie tworzyły
węzłów, nie przypisywały wartości i nie zmieniały właściwości. Tymczasowy
ledger znajduje się w `/tmp/align-ui-audit-ledger.json` i nie jest częścią
repozytorium. Screenshoty kontrolne również pozostały w `/tmp`.

Zastosowane definicje:

- `Component Sets` — wszystkie węzły `COMPONENT_SET`;
- `Standalone masters` — `COMPONENT`, którego rodzicem nie jest
  `COMPONENT_SET`;
- `Variants` — komponent będący bezpośrednim dzieckiem `COMPONENT_SET`;
- `Raw frames` — frame nieznajdujący się wewnątrz instancji, komponentu ani
  component setu;
- `Instance share` — `instances / (instances + raw frames)` w badanym korzeniu;
- `Alias share` — przypisania `VARIABLE_ALIAS` / wszystkie przypisania
  variable–mode;
- `Token coverage` — liczba kwalifikujących się wystąpień właściwości ze Style
  lub Variable bindingiem / wszystkie kwalifikujące się wystąpienia;
- `Hardcoded rate` — dopełnienie `Token coverage` do 100%.

W metryce token coverage kwalifikują się fills, strokes, aktywna grubość
obramowania, radius, cztery paddingi, gap i typografia. Obrazy, transformacje,
opacity stanu, mechanika layoutu i motion są wyłączone. W przypadku tekstu
Text Style jest uznawany za binding typografii. Wartości procentowe dla próbek
są wskaźnikiem strukturalnym, a nie oceną wizualną.

**Interpretacja.** Wartość `raw frames = 0` na stronie komponentów produktowych
lub landingowych nie oznacza, że ich wnętrze jest w pełni komponentyzowane.
Oznacza jedynie, że frame'y są potomkami mastera. Dlatego dla pogłębionych
próbek policzono osobno frame'y wewnątrz wariantów, z pominięciem wnętrza
zagnieżdżonych instancji.

**Obserwacja.** Dostępności semantycznej przeglądarki nie wyprowadzano
z wyglądu Figmy. Potwierdzano tylko nazwy, opisy, właściwości i strukturę.
ARIA, natywne elementy HTML, obsługa klawiatury i runtime pozostają code-owned.

## 3. Architektura pliku i Pages

### Sumy kategorii

| Kategoria | Strony | CS | Standalone | Warianty | Instancje | Sekcje | Frame'y | Raw frames |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Start / onboarding | 6 | 6 | 3 | 70 | 322 | 0 | 1 174 | 665 |
| Foundations | 8 | 0 | 3 061 | 0 | 251 | 0 | 4 959 | 4 719 |
| Assets | 8 | 14 | 1 235 | 206 | 447 | 23 | 1 281 | 812 |
| Base Components | 41 | 120 | 7 | 3 445 | 16 969 | 0 | 11 768 | 4 423 |
| Sector Products | 6 | 52 | 31 | 327 | 18 971 | 3 | 18 602 | 9 323 |
| Product Components | 5 | 36 | 1 | 253 | 1 756 | 14 | 1 217 | 0 |
| Landing Page | 21 | 30 | 4 | 621 | 11 020 | 0 | 20 671 | 80 |
| **Razem** | **95** | **258** | **4 342** | **4 922** | **49 736** | **40** | **59 672** | **20 022** |

**Obserwacja.** Sześć pustych stron nagłówkowych (`Core Elements`, `Assets`,
`Base Components`, `Sector Products`, `Product Components`, `Landing Page`)
działa jak separatory. Wszystkie strony podrzędne poza Typography mają osiem
leading spaces; Typography ma dziewięć. Nagłówki używają `✲ ・`, a strony
podrzędne `↪️ ❖`.

**Interpretacja.** Model jest szybki do skanowania wzrokiem, ale opiera
hierarchię na whitespace i ikonach bez jawnej legendy. Jedno odstępstwo
Typography pokazuje, że wcięcie nie jest stabilnym kontraktem maszynowym.

**Obserwacja.** Base Components zawiera 40 szczegółowych stron i jeden nagłówek.
W szczegółowych stronach jest 120 component setów, 7 samodzielnych masterów
i 3 445 wariantów. Assets i Icons odpowiadają za 4 296 z 4 342 standalone
masters, więc sama liczba standalone masters nie może być utożsamiana
z publicznym API komponentów.

**Rekomendacja.** W MPCOM kategoria, typ strony i status publikowania powinny
wynikać z numerowanego namingu oraz zamkniętej legendy, nie z samych emoji.
Publiczne mastery, `_Parts` i elementy dokumentacyjne muszą być nazwane
odmiennie.

## 4. Foundations, Variables i Styles

### Warstwa dokumentacyjna foundations

| Obszar | Struktura canvasu | Ocena |
| --- | --- | --- |
| Color Palette | osobne Overview, Token System i Guidelines | czytelnie rozdziela paletę, role i zasady |
| Typography | Overview i Guidelines | szeroki katalog ról; brak Variable bindings w Text Styles osłabia automatyzację |
| Icons | Overview, Guidelines i 3 061 glyph masters | bardzo kompletne assets; liczba masterów nie jest publicznym API UI |
| Grid System | Overview i Guidelines | dobrze wizualizuje shell 1440; nie opisuje kodowego stanu pośredniego MPCOM |
| Shadows | Overview i Guidelines | 27 Effect Styles, z czego 21 ma bindings |
| Motions & Animations | osobny Overview | brak dedykowanej kolekcji motion Variables |
| Corner Radius | osobny Overview | kompletna skala 12 wartości, ale mało reużywana przez bindings geometrii |

**Obserwacja.** Foundations konsekwentnie reużywają dokumentacyjne instancje
Header, Footer, Hero, Features i Separator. Dzięki temu materiał ma wspólny
język wizualny, choć jego reguły nie są przenoszone do descriptions.

### Align UI — kolekcje

| Kolekcja | Variables | Tryby | Przypisania | Aliasy | Alias share | `ALL_SCOPES` | Web syntax | Opisy |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `01-Tokens` | 137 | Light, Dark | 274 | 252 | 91,97% | 137 | 0/137 | 0 |
| `02-Neutral` | 12 | Gray, Slate | 24 | 24 | 100% | 12 | 0/12 | 0 |
| `03-Theme` | 13 | Blue, Purple, Orange, Green | 52 | 52 | 100% | 13 | 0/13 | 0 |
| `04-Radius` | 12 | jeden | 12 | 0 | 0% | 0 | 0/12 | 0 |
| `05-Spacing` | 13 | jeden | 13 | 0 | 0% | 0 | 0/13 | 0 |
| `06-Foundations` | 189 | jeden | 189 | 0 | 0% | 189 | 0/189 | 0 |
| **Razem** | **376** |  | **564** | **328** | **58,16%** | **351** | **0/376** | **0** |

**Obserwacja.** `06-Foundations` zawiera palety bazowe: 24 neutralne wartości,
9 rodzin kolorów po 11 kroków i 66 wartości alpha. `01-Tokens` mapuje role
Light/Dark, `03-Theme` dostarcza cztery tryby brandowe, a `02-Neutral`
przełącza Gray/Slate. Skale radiusu i spacingu są bezpośrednimi wartościami.

**Obserwacja.** Radius zawiera `0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28`
i `full=999`. Spacing zawiera `0, 2, 4, 6, 8, 10, 12, 14, 16, 24, 32, 40,
48`. Wszystkie mają wąski scope właściwości i są dostępne do publikowania.
Żadna z 376 Variables nie jest ukryta przed publikowaniem.

**Interpretacja.** Warstwy foundation → neutral/theme → tokens są czytelne
dla projektanta. Cztery brand themes są atrakcyjne demonstracyjnie, ale
zwiększają koszt adaptera do kodu, jeżeli produkt nie ma rzeczywistego
kontraktu wielomarkowego.

**Obserwacja.** 351 Variables ma `ALL_SCOPES`; żadna nie ma pustego scopes.
Wszystkie 376 nie mają Web code syntax i opisu. W konsekwencji nazwa zmiennej
jest jedynym trwałym śladem mapowania do kodu.

**Rekomendacja.** MPCOM powinien zachować precyzyjne scopes, descriptions
i Web code syntax. Model brand themes należy dodać dopiero po pojawieniu się
realnego kontraktu biznesowego, jako adapter nad semantic colors, nie jako
równoległą warstwę publicznego API.

### MPCOM — kolekcje

| Kolekcja | Variables | Tryby | Przypisania | Alias share | Puste scopes | Brak Web syntax | Opisy |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| Color Primitives | 69 | Value | 69 | 1,45% | 69 | 0 | 69 |
| Color Semantic | 152 | Light, Dark | 304 | 97,37% | 0 | 0 | 152 |
| Sizing Primitives | 25 | Value | 25 | 0% | 25 | 0 | 25 |
| Sizing Semantic | 55 | Max, Min | 110 | 98,18% | 0 | 0 | 54 |
| Component Size | 7 | Medium, Small, Large | 21 | 0% | 0 | 0 | 7 |
| Typography Foundations | 29 | Max, Min | 58 | 0% | 0 | 0 | 29 |
| Typography Semantic | 33 | Max, Min | 66 | 33,33% | 0 | 0 | 33 |
| Layout Foundations | 2 | Max, Min | 4 | 0% | 2 | 1 | 2 |
| Layout Semantic | 11 | Desktop, Mobile | 22 | 27,27% | 1 | 0 | 11 |

**Obserwacja.** Jedyny brak Web code syntax w MPCOM dotyczy kontrolowanego
wyjątku `Layout Foundations / fluid/viewport`, którego dwa tryby mapują dwa
końce kodowego kontraktu. 382 z 383 Variables ma description.

**Interpretacja.** MPCOM ma więcej kolekcji, ale ich rozdzielenie odpowiada
źródłom prawdy w CSS: primitive, semantic, component size, typography
i layout. Jest to bardziej deterministyczne dla Figma ↔ Astro niż krótszy,
bardziej prezentacyjny model Align UI.

### Styles

| Typ | Align UI | Z bindingiem | Z opisem | MPCOM | Z bindingiem | Z opisem |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Text | 34 | 0 | 0 | 23 | 23 | 23 |
| Effect | 27 | 21 | 0 | 2 | 0 | 2 |
| Paint | 37 | 9 | 0 | 0 | — | — |
| Grid | 4 | 0 | 0 | 1 | 1 | 1 |

**Obserwacja.** Align UI ma 34 role tekstowe obejmujące m.in. Landing Title,
Title, Label, Paragraph, Subheading, DM Mono i Docs. MPCOM ma 23 Text Styles:
11 globalnych ról i 12 ról komponentowych, wszystkie opisane i powiązane
ze zmiennymi.

**Obserwacja.** 20 Paint Styles Align UI koduje kombinacje
sektor × desktop/mobile × light/dark. Pozostałe obejmują gradienty i rampy.
Tylko 9/37 ma Variable bindings.

**Interpretacja.** Paint Styles dobrze wspierają prezentację gotowych
template'ów, ale nie są dobrym publicznym kontraktem kodowym. Podejście MPCOM
oparte na Variables ogranicza równoległe źródła prawdy.

**Obserwacja.** Cztery Grid Styles Align UI są zbudowane dla szerokości 1440
i wariantów shell/navigation. Próbki landingowe używają 1600/390. MPCOM
kontroluje 1440/320 w Figmie oraz 8-kolumnowy stan pośredni w kodzie.

**Rekomendacja.** MPCOM powinien zachować jeden zmienny Grid Style i jawne
tryby Desktop/Mobile. Warto dodać dokumentacyjne przykłady 1440/320 oraz
pośredni viewport, zamiast mnożyć Grid Styles dla każdej kompozycji.

## 5. Base Components i dokumentacja

### Pokrycie dokumentacyjne

**Obserwacja.** Wszystkie 40 szczegółowych stron mają frame `Overview`,
39 ma `Guidelines`, 35 ma `Examples`, 23 ma `Prototype`, a 24 ma `Blocks`.
Jednocześnie 0/120 component setów, 0/7 standalone masters i 0/3 445
wariantów ma niepusty `description`.

**Interpretacja.** Align UI inwestuje w dokumentację na canvasie, ale nie
przenosi najważniejszych reguł do metadanych mastera. Człowiek może odczytać
stronę; agent lub integracja Code Connect nie otrzymuje krótkiego kontraktu
bez parsowania layoutu dokumentacyjnego.

### Pogłębione próbki

| Próbka | Page ID | Master / set ID | Struktura | Coverage | Hardcoded |
| --- | --- | --- | --- | ---: | ---: |
| Button | `129:605` | `129:1422` | 384 warianty: 3 typy × 4 style × 4 stany × 4 rozmiary × icon-only; TEXT, BOOLEAN, INSTANCE_SWAP | 37,80% | 62,20% |
| Text Input | `266:5230` | `266:5251` | 216 wariantów: 12 typów × 6 stanów × 3 rozmiary; TEXT, BOOLEAN, INSTANCE_SWAP | 39,08% | 60,92% |
| Checkbox | `227:1986` | `227:2002` | 24 warianty: 4 stany × selected × indeterminate × 2 rozmiary | 58,75% | 41,25% |
| Accordion | `210:4006` | `210:4022` | 6 wariantów: 3 stany × flip icon; TEXT, BOOLEAN, INSTANCE_SWAP | 42,48% | 57,52% |

Wartości coverage są liczone dla wskazanego mastera według wspólnej metody
z sekcji 2.

#### Button

**Obserwacja.** Strona zawiera pięć publicznych setów i 648 wariantów:
Compact 64, Fancy 36, Social 84, Link 80 i główny Button 384. Główny set ma
TEXT dla etykiety, BOOLEAN dla elementów opcjonalnych oraz INSTANCE_SWAP dla
ikon. Auto Layout występuje praktycznie we wszystkich frame'ach. Kolory,
radius i typografia są zwykle związane, ale 0/2 304 wystąpień paddingu,
0/576 gapów i 0/121 grubości obramowań ma binding.

**Interpretacja.** Ergonomia instancji jest mocna, lecz rozmiar, state,
icon-only i style są kodowane iloczynem wariantów. 384 warianty głównego
Buttona są nieproporcjonalne do publicznego kontraktu i utrudniają audyt.

**Rekomendacja.** Zachować TEXT/BOOLEAN/INSTANCE_SWAP i nested icons, ale
pozostawić MPCOM Button przy 15 wariantach oraz globalnym trybie Component
Size. Runtime state nie powinien tworzyć nowych propsów Astro.

#### Text Input

**Obserwacja.** Strona ma pięć setów i 264 warianty. Główny Text Input ma
12 wizualnych typów, 6 stanów i 3 rozmiary. Reużywa 1 443 nested instances,
w tym label, hint, select, password strength, button, ikony, flagi i emoji.
Wszystkie 1 192 kwalifikujące się wystąpienia typografii są oparte na stylach,
ale 0/4 480 paddingów i 0/250 grubości obramowań ma binding.

**Interpretacja.** Bogata lista typów dobrze pokazuje kompozycje, ale część
z nich jest w kodzie osobnym atomem lub molekułą, a nie `type` jednego inputa.
Skopiowanie osi do Astro stworzyłoby sztuczne propsy.

**Rekomendacja.** W MPCOM utrzymać osobne kontrakty Input, Select,
SearchInput i FormField. W Figmie można prezentować kompozycje jako przykłady
lub prywatne parts bez łączenia ich w jeden publiczny set.

#### Checkbox

**Obserwacja.** Główny Checkbox ma 24 warianty. Label jest osobnym setem
8 wariantów z TEXT/BOOLEAN, a Checkbox Card osobnym setem 24 wariantów
z sześcioma typami i nested instances. Główny glyph nie używa Auto Layout,
natomiast Label i Card go używają. Wizualnie potwierdzono stany unchecked,
checked i indeterminate w dwóch rozmiarach.

**Interpretacja.** Oddzielenie kontrolki, labelu i karty jest dobrym wzorcem
kompozycyjnym. Oś `Active` lepiej nazywać `Selection`, a semantykę label/input
pozostawić kodowi.

**Rekomendacja.** MPCOM powinien zachować 15 wariantów
Selection × State, w tym Indeterminate, a label i kartę budować jako
kompozycje. Nie dodawać wizualnej karty do publicznego API atomu Checkbox.

#### Accordion

**Obserwacja.** Jeden set ma 6 wariantów, instance swap ikony, boolean left
icon oraz edytowalne title/description. Wewnątrz znajduje się 9 nested
instances. Próbka wizualna potwierdza stan zamknięty, hover i otwarty
z opisem oraz dwa położenia ikony.

**Interpretacja.** Master reprezentuje pojedynczy item, mimo nazwy Accordion.
Nie modeluje dowolnej liczby elementów ani natywnego runtime disclosure.

**Rekomendacja.** Zachować w MPCOM publiczny, slotowy Accordion oraz prywatny
`_Parts/Accordion.Item`. Nie wprowadzać osi count ani publicznego prop
odpowiadającego wizualnemu `Flip Icon`.

### Wspólny wniosek o bindings

**Obserwacja.** We wszystkich czterech próbkach fills, typography i część
radiusów mają dobre pokrycie. Największa wspólna luka to brak bindings
paddingu, gapu i border width. Dlatego hardcoded rate wynosi od 41,25%
do 62,20% nawet przy dużym użyciu tokenów kolorystycznych.

**Rekomendacja.** MPCOM nie powinien naśladować tej luki. Wygenerowane lub
aktualizowane mastery muszą używać `Sizing Semantic` dla paddingów, gapów,
radiusów i każdej aktywnej krawędzi obramowania.

## 6. Produkty i sekcje landingowe

### Sector Products

**Obserwacja.** Kategoria zawiera nagłówek oraz pięć sektorów: HR Management,
Finance & Banking, Marketing & Sales, Cryptocurrency i AI Product. Łącznie
ma 52 component sety, 31 standalone masters, 327 wariantów, 18 971 instancji
i 9 323 raw frames.

**Obserwacja.** Strona Finance & Banking (`3911:35677`) nie ma lokalnych
component setów ani masterów; składa ekrany z istniejących instancji i raw
frames. Próbka `Transactions [Finance & Banking]` (`3965:46276`) ma szerokość
1440, 66 instancji, 11 raw frames i instance share 85,71%. Token coverage
wynosi 28,12%; padding, gap i border width są bez bindings.

**Interpretacja.** Ekran pokazuje dużą korzyść z reużycia na poziomie produktu,
ale nadal łączy biblioteczne instancje z lokalnymi strukturami. Brak lokalnych
masterów ułatwia odróżnienie produktu od biblioteki, choć powtarzalne układy
ekranowe nie propagują się globalnie.

### Product Components

| Strona | Page ID | Component Sets | Warianty | Instancje |
| --- | --- | ---: | ---: | ---: |
| Navigation | `3789:4743` | 11 | 61 | 440 |
| Page Headers | `3829:27858` | 2 | 10 | 93 |
| Widgets | `2950:5881` | 21 | 148 | 1 221 |
| Empty States | `3860:4301` | 2 | 34 | 2 |

**Obserwacja.** Navigation ma osobne mastery dla elementów sidebar/topbar,
headerów, profilu, feature cards oraz dwóch organizmów: Sidebar
`3802:11759` i Topbar `3814:25274`. Instance share tych organizmów wynosi
odpowiednio 65,57% i 75%. Token coverage wynosi 30,33% i 29,84%.
Wszystkie component descriptions są puste.

**Interpretacja.** Hierarchia atom → część nawigacji → shell jest dobrym
wzorcem. Osie `Product` zakodowane w organizmie są jednak treściowym
wariantem demo, nie stabilnym API nawigacji.

**Rekomendacja.** MPCOM powinien rozwijać istniejące NavSidebar, TopNavbar
i GlobalHeader przez Sloty oraz dane, nie przez warianty nazw sektorów.

### Landing Page — przegląd

**Obserwacja.** Kategoria ma 21 stron, w tym pusty nagłówek, stronę Examples &
Templates, 18 stron sekcji i Assets. Strony sekcji mają 30 component setów,
621 wariantów i 11 020 instancji. Najczęstszy model to `Type × Mobile`;
CTA i Navigation dodają kolejne osie.

| Próbka | Set ID | Warianty / model | Instance share wewnątrz setu | Token coverage |
| --- | --- | --- | ---: | ---: |
| Navigation | `191290:50634` | 8 typów i osie collapsed/opened/mobile; 48 wariantów | 71,50% | 27,47% |
| Features | `191424:10456` | 12 typów × desktop/mobile = 24 | 23,19% | 27,60% |
| How it works | `191422:8134` | 12 typów × desktop/mobile = 24 | 29,19% | 30,59% |
| Custom CTA | `191434:15960` | 5 typów × desktop/mobile = 10 | 19,44% | 21,59% |
| CTA | `192516:10023` | 9 typów × 2 style × desktop/mobile = 36 | 44,86% | 24,61% |

**Interpretacja.** Komponentyzacja całej sekcji ułatwia jej wstawienie, ale
niski instance share wewnątrz Features, How it works i CTA oznacza, że duża
część powtarzalnych kart, kroków i mediów nadal jest surową strukturą.

### How it works — macierz 12 × desktop/mobile

| Typ | Desktop: node, rozmiar, I/R, share | Mobile: node, rozmiar, I/R, share | Powtarzalne raw frames |
| --- | --- | --- | --- |
| 01 | `191422:8133`, 1600×568, 4/13, 23,53% | `191422:8131`, 390×700, 4/12, 25,00% | 3× Card |
| 02 | `191422:8132`, 1600×576, 1/21, 4,55% | `191422:8130`, 390×948, 1/21, 4,55% | 9× Shape, 3× Item |
| 03 | `191569:21978`, 1600×1008, 9/25, 26,47% | `191569:23581`, 390×1018, 9/22, 29,03% | 4× Step, 3× Image |
| 04 | `191775:11550`, 1600×1092, 34/49, 40,96% | `191775:12016`, 390×2078, 34/48, 41,46% | 4× Dropdown Items, 3× Card |
| 05 | `191871:34139`, 1600×1020, 5/11, 31,25% | `191871:34140`, 390×1110, 5/12, 29,41% | 2× Item |
| 06 | `192139:81135`, 1600×936, 5/31, 13,89% | `192190:47571`, 390×988, 5/27, 15,63% | 3× Steps/Profile/Image |
| 07 | `192139:81134`, 1600×976, 6/29, 17,14% | `192190:47567`, 390×978, 6/28, 17,65% | 3× Steps/Number/Image |
| 08 | `192151:94377`, 1600×1068, 7/21, 25,00% | `192190:47565`, 390×827, 7/20, 25,93% | 3× Image |
| 09 | `192155:96573`, 1600×712, 10/28, 26,32% | `192190:47570`, 390×1264, 10/28, 26,32% | 3× Step/Number/Image |
| 10 | `192156:97180`, 1600×1108, 16/26, 38,10% | `192190:47569`, 390×1152, 16/27, 37,21% | 3× Accordion/Button/Number |
| 11 | `192156:122682`, 1600×792, 17/29, 36,96% | `192190:47568`, 390×1216, 17/27, 38,64% | 3× Accordion/Button/Number |
| 12 | `192156:123927`, 1600×568, 8/19, 29,63% | `192190:47566`, 390×716, 8/18, 30,77% | 3× Step/Image |

`I/R` oznacza odpowiednio nested instances / raw frames wewnątrz wariantu.

**Obserwacja.** Wszystkie 12 par istnieją jako warianty jednego component setu
i używają dokładnie 1600/390. Nested instances obejmują głównie istniejące
ikony, przyciski, avatary i inne base components. Powtarzalne struktury Step,
Card, Item, Profile, Number, Accordion i Image często pozostają frame'ami.

**Interpretacja.** Globalna zmiana propaguje się na poziomie całej sekcji oraz
użytych base components, ale nie na poziomie większości powtarzalnych części
sekcyjnych. Co najmniej dwa równoważne sibling frames bez wspólnego mastera
spełniają przyjęte kryterium luki komponentyzacji.

**Rekomendacja.** Dla MPCOM najpierw tworzyć reusable section parts
(`SectionHeading`, `FeatureCard`, `StepItem`, `MetricCard`, `MediaFrame`),
następnie organizmy sekcji i dopiero templates. Desktop/mobile powinny być
odrębnym wariantem tylko wtedy, gdy zmienia się struktura, nie przy każdej
zmianie układu możliwej do obsłużenia przez layout i tryby.

### Examples & Templates — pełna para

**Obserwacja.** Pierwsza w kolejności canvasu kompletna para o wspólnej nazwie
to `Hero [Landing]`: desktop `193300:326049` ma 1600×6262, a mobile
`193737:120487` ma 390×9234. Desktop ma 16 instancji i 0 raw frames
w korzeniu, mobile 16 instancji i 2 raw frames. Token coverage wynosi
odpowiednio 29,47% i 31,34%. Para spełnia wymóg 1600/390.

**Interpretacja.** Templates dobrze pokazują całe strony i kolejność sekcji,
ale równoległe kompletne frame'y desktop/mobile zwiększają koszt aktualizacji.
Zmiana mastera sekcji propaguje się, natomiast zmiana kolejności lub lokalnego
łączenia sekcji musi zostać powtórzona w obu template'ach.

## 7. Align UI ↔ MPCOM

| Obszar | Align UI | MPCOM | Decyzja |
| --- | --- | --- | --- |
| Information architecture | 95 stron, silne kategorie i katalog przykładów | 26 stron, 12 rodzin, proste separatory | Zaadaptować hierarchię, uprościć symbole |
| Variables | krótszy model, brand themes, brak opisów i Web syntax | 9 warstw zgodnych z CSS, prawie pełne opisy i syntax | Zachować MPCOM |
| Styles | bogate Paint/Effect/Text, część jako presentation API | mniej stylów, wszystkie Text Styles związane | Adaptować tylko uzasadnione styles |
| Komponenty | szeroka oferta i bardzo duże macierze wariantów | 66 komponentów zgodnych z kodem, kontrolowany limit wariantów | Zachować kontrakty MPCOM |
| Dokumentacja | overview/guidelines/examples/prototypes na canvasie | mocne reguły Markdown, słabsza warstwa przykładów w Figmie | Połączyć oba podejścia |
| Responsywność | najczęściej pełny wariant 1600/390 | Desktop/Mobile plus code-owned stan pośredni | Adaptować selektywnie |
| Reużycie | dużo instancji, lecz sekcyjne parts często raw | silny atom/molecule/organism i Slot policy | Rozszerzyć o sekcje bez spłaszczania |
| Figma ↔ Astro | nazwy są głównym adapterem | Web syntax, descriptions i numerowane adaptery | Zachować MPCOM jako source of truth |

## 8. Keep / Adapt / Avoid

| Keep | Adapt | Avoid |
| --- | --- | --- |
| Jeden czytelny obszar na kategorię | Strony Overview / Guidelines / Examples | Kopiowanie 384 wariantów Buttona |
| Nested instances ikon i base components | Gotowe produkty jako test reużycia | Brand jako wariant treści organizmu |
| TEXT, BOOLEAN i INSTANCE_SWAP | 1600/390 jako materiał porównawczy | Brak Web code syntax i descriptions |
| Osobne strony produktów i landing sections | Cztery brand themes tylko przy realnym wymaganiu | Paint Styles jako równoległe źródło tokenów |
| Pełne template'y jako przykłady | Canvas documentation + metadata mastera | Powtarzalne karty/kroki jako raw frames |
| Jawne pary desktop/mobile | Wariant mobile tylko przy zmianie struktury | Runtime state jako nowe publiczne propsy |

## 9. Rejestr rekomendacji

| Problem | Dowód | Rekomendacja | Korzyść | Priorytet | Horyzont |
| --- | --- | --- | --- | --- | --- |
| Nawigacja MPCOM nie ma zamkniętej legendy | separatory `---`, pojedyncze `⇥ Actions` | numerowane grupy i cztery dozwolone markery | szybsza nawigacja człowieka i agenta | P0 | Quick win |
| Brakuje powtarzalnego wzorca strony komponentu | Align: 40/40 Overview, 39/40 Guidelines | wdrożyć jeden szablon opisany w sekcji 11 | spójne review i onboarding | P0 | Quick win |
| Dokumentacja canvasowa nie jest w metadata | Align: 0/120 opisanych setów | każdemu publicznemu masterowi dodać krótki kontrakt | agent nie musi parsować layoutu | P0 | Quick win |
| Geometria łatwo staje się hardcoded | próbki Align: 0 bindings paddingu i border width | utrzymać obowiązkowe Sizing Semantic bindings | deterministyczna zmiana globalna | P0 | Quick win |
| Eksplozja wariantów zaciera API | Button 384, Text Input 216 | limitować osie do realnych propsów; size przez tryb | mniejszy koszt QA i synchronizacji | P0 | Quick win |
| Brak sekcyjnych building blocks | How it works: powtarzalne Step/Card/Image jako frame'y | dodać prywatne i publiczne section parts | globalna propagacja i mniej duplikacji | P1 | Średni |
| Brakuje katalogu kompozycji | MPCOM ma komponenty, ale nie odpowiednik 18 stron sekcji | dodać Compositions i Examples po ustabilizowaniu parts | testowanie realnych połączeń | P1 | Średni |
| Pełne pary responsive są kosztowne | template 1600/390 i 24 warianty How it works | wariant strukturalny + code-owned responsywność | mniej podwójnych zmian | P1 | Średni |
| Product demos mogą przeciekać do API | Align Navigation ma oś `Product` z nazwami sektorów | treść przez dane/Sloty, nie wariant produktu | neutralność startera | P1 | Średni |
| Multi-brand może rozbudować adapter bez potrzeby | cztery tryby Theme | uruchamiać dopiero z realnym wymaganiem marki | mniejsza liczba kontraktów | P2 | Docelowy |
| Brak proof pages dla Astro/React | obecne adaptery są Astro-first | po stabilizacji stworzyć framework-neutral core i adapter React | kontrolowana ekspansja | P2 | Docelowy |

## 10. Docelowe drzewo Pages MPCOM

Zalecany kontrakt nazw:

```text
00 ◆ Start
01 ◆ Architecture
  01.01 ↳ Variables
  01.02 ↳ Components
02 ◆ Foundations
  02.01 ↳ Color
  02.02 ↳ Typography
  02.03 ↳ Sizing
  02.04 ↳ Layout
  02.05 ↳ Effects & Motion
03 ◆ Assets
  03.01 ↳ Icons
04 ◆ Components
  04.01 ◇ Actions
  04.02 ◇ Forms
  04.03 ◇ Data Display
  04.04 ◇ Text
  04.05 ◇ Content
  04.06 ◇ Disclosure
  04.07 ◇ Media
  04.08 ◇ Visual
  04.09 ◇ Navigation
  04.10 ◇ Cards
  04.11 ◇ Sidepanels
  04.12 ◇ Timeline
05 ◆ Compositions
  05.01 ↳ Section Parts
  05.02 ↳ Landing Sections
  05.03 ↳ Product Shells
06 ◆ Examples
  06.01 ▣ Component Recipes
  06.02 ▣ Landing Templates
  06.03 ▣ Product Screens
90 ◆ Internal
  90.01 ↳ _Parts
  90.02 ↳ Audit & Migration
```

Zamknięta legenda:

- `◆` — wyłącznie nagłówek kategorii;
- `↳` — strona foundations, architecture, composition lub internal;
- `◇` — strona publicznej rodziny komponentów;
- `▣` — strona przykładów lub template'ów;
- `_Parts/` — jedyny prefiks prywatnego mastera; nie jest publicznym API.

**Rekomendacja.** Nie dodawać innych ikon semantycznych. Wcięcie ma służyć
czytelności, ale numer jest źródłem kolejności i kategorii.

## 11. Wzorzec strony pojedynczego komponentu

Każda publiczna strona lub sekcja komponentu powinna mieć stałą kolejność:

1. `Contract` — nazwa, rola, source path Astro, status public/private;
2. `Master` — kanoniczny component set i kontrolowana macierz wariantów;
3. `Anatomy` — exposed instances, Sloty i prywatne `_Parts`;
4. `Properties` — mapowanie Figma property → Astro prop/data/slot;
5. `States` — design states oraz osobno code-owned runtime states;
6. `Sizing & responsive` — Component Size, hug/fill i wyjątki strukturalne;
7. `Tokens` — wymagane collections, modes i binding checklist;
8. `Usage` — kiedy używać, kiedy nie używać, ograniczenia;
9. `Examples` — co najmniej jedna realna kompozycja;
10. `Validation` — node ID, liczba wariantów, description i zgodność adaptera.

**Rekomendacja.** Master powinien być łatwy do znalezienia bez przewijania
przez przykłady, a dokumentacyjne frame'y nie mogą być publikowane jako
komponenty.

## 12. Szablon krótkiej dokumentacji

```md
### ComponentName

Rola:
Jedno zdanie opisujące odpowiedzialność komponentu.

Kiedy używać:
- ...

Kontrakt:
- Figma master:
- Astro source:
- Properties → props/data/slots:
- Component Size / responsive:

Ograniczenia:
- co pozostaje code-owned;
- czego nie modelować jako wariantu;
- jakie `_Parts` są prywatne.

Figma ↔ Astro:
- wymagane Variables, Styles i Web code syntax;
- świadome różnice reprezentacji.

Agentic rules:
- reguła rodziny:
- zakazane skróty:
- checklista walidacji:
```

## 13. Model sekcji dla MPCOM

```text
tokens
  → atoms
    → molecules / reusable cards
      → section organisms
        → templates / product examples
```

Kontrakt warstw:

- atomy: typografia, ikony, akcje, inputy i proste media;
- molecules/cards: powtarzalna jednostka treści, np. FeatureCard lub StepItem;
- section organisms: kolejność i layout jednostek, heading, CTA i media;
- templates: kolejność sekcji, przykładowe dane i punkty kontrolne viewportu.

**Rekomendacja.** Karta lub krok powtarzający się co najmniej dwa razy
w obrębie sekcji powinien być wspólnym masterem albo świadomie opisanym
wyjątkiem. Template ma używać instancji sekcji; sekcja ma używać instancji
kart/parts; parts mają używać publicznych base components.

## 14. Roadmapa

### Quick wins — obecna Figma

1. Wprowadzić docelowy naming Pages i zamkniętą legendę.
2. Dodać krótki description do każdego publicznego mastera.
3. Zastosować wzorzec strony komponentu do 12 rodzin.
4. Uzupełnić checklistę bindings dla paddingu, gapu, radiusu i border width.
5. Zachować audyt 66/66 jako blokadę publikowania.

### Rozwój średnioterminowy — sekcje i przykłady

1. Zdefiniować mały katalog section parts.
2. Zbudować pierwsze reusable compositions z obecnych 66 komponentów.
3. Dodać Examples dla realnych połączeń i stanów pustych/błędów.
4. Utworzyć jedną parę pełnej strony desktop/mobile jako proof, bez
   automatycznego mnożenia wszystkich sekcji.
5. Mierzyć instance share i token coverage na checkpointach.

### Architektura docelowa — Astro, później React

1. Utrzymać Astro i CSS tokens jako źródło prawdy.
2. Oddzielić framework-neutralne dane, tokeny i kontrakty od renderera.
3. Stabilizować section organisms w Astro.
4. Dodać React adapter dopiero dla zatwierdzonych kontraktów, bez kopiowania
   wizualnych osi Figmy do propsów.
5. Zachować te same node ID mappings, descriptions i testy architektury.

## 15. Pełny inwentarz 95 stron Align UI

Legenda liczników: `CS` — Component Sets, `SM` — standalone masters,
`V` — warianty, `I` — instancje, `S` — sekcje, `F` — wszystkie frame'y,
`RF` — raw frames. Zapis `8×␠` zachowuje liczbę leading spaces surowej nazwy.

| # | Kategoria | Surowa nazwa strony | Page ID | CS | SM | V | I | S | F | RF |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | Start | `⦿  ・ Cover` | `0:1` | 0 | 0 | 0 | 1 | 0 | 7 | 7 |
| 2 | Start | `✢  ・ Welcome` | `553:15317` | 0 | 0 | 0 | 54 | 0 | 146 | 102 |
| 3 | Start | `✦  ・ Get Started` | `553:15318` | 0 | 0 | 0 | 182 | 0 | 675 | 296 |
| 4 | Start | `✉︎  ・ Changelog` | `6677:1135` | 0 | 0 | 0 | 62 | 0 | 271 | 240 |
| 5 | Start | `⚙︎  ・ Buy AlignUI DS` | `8623:85` | 0 | 0 | 0 | 8 | 0 | 21 | 20 |
| 6 | Start | `✫  ・ Presentation Assets` | `553:15316` | 6 | 3 | 70 | 15 | 0 | 54 | 0 |
| 7 | Foundations | `✲  ・ Core Elements` | `210:4004` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 8 | Foundations | `8×␠ ↪️  ❖  Color Palette` | `553:14956` | 0 | 0 | 0 | 102 | 0 | 829 | 768 |
| 9 | Foundations | `9×␠ ↪️ ❖  Typography` | `553:14957` | 0 | 0 | 0 | 23 | 0 | 185 | 151 |
| 10 | Foundations | `8×␠ ↪️  ❖  Icons` | `41:136` | 0 | 3 061 | 0 | 38 | 0 | 3 232 | 3 198 |
| 11 | Foundations | `8×␠ ↪️  ❖  Grid System` | `553:14958` | 0 | 0 | 0 | 24 | 0 | 438 | 404 |
| 12 | Foundations | `8×␠ ↪️  ❖  Shadows` | `553:14959` | 0 | 0 | 0 | 22 | 0 | 107 | 73 |
| 13 | Foundations | `8×␠ ↪️  ❖  Motions & Animations` | `553:14960` | 0 | 0 | 0 | 17 | 0 | 73 | 57 |
| 14 | Foundations | `8×␠ ↪️  ❖  Corner Radius` | `553:14961` | 0 | 0 | 0 | 25 | 0 | 95 | 68 |
| 15 | Assets | `✲  ・ Assets` | `2771:1467` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 16 | Assets | `8×␠ ↪️  ❖  Brand` | `2771:1469` | 1 | 355 | 84 | 256 | 19 | 562 | 503 |
| 17 | Assets | `8×␠ ↪️  ❖  Placeholder` | `172:5573` | 10 | 0 | 28 | 86 | 1 | 185 | 157 |
| 18 | Assets | `8×␠ ↪️  ❖  Country Flags` | `2771:1471` | 0 | 263 | 0 | 13 | 1 | 31 | 4 |
| 19 | Assets | `8×␠ ↪️  ❖  Emojies` | `2771:1472` | 0 | 607 | 0 | 13 | 1 | 31 | 4 |
| 20 | Assets | `8×␠ ↪️  ❖  Appstore Badges` | `2771:1470` | 1 | 0 | 16 | 70 | 0 | 167 | 140 |
| 21 | Assets | `8×␠ ↪️  ❖  Thumbnails` | `193450:30395` | 2 | 0 | 78 | 0 | 0 | 285 | 0 |
| 22 | Assets | `8×␠ ↪️  ❖  Others` | `2771:1473` | 0 | 10 | 0 | 9 | 1 | 20 | 4 |
| 23 | Base | `✲  ・ Base Components` | `210:4005` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 24 | Base | `8×␠ ↪️  ❖  Alert, Notification & Toast` | `169:2358` | 1 | 0 | 60 | 297 | 0 | 243 | 114 |
| 25 | Base | `8×␠ ↪️  ❖  Accordion` | `210:4006` | 1 | 0 | 6 | 163 | 0 | 224 | 131 |
| 26 | Base | `8×␠ ↪️  ❖  Activity Feed` | `164611:26451` | 5 | 0 | 16 | 241 | 0 | 277 | 113 |
| 27 | Base | `8×␠ ↪️  ❖  Avatar` | `210:4129` | 5 | 0 | 674 | 1 642 | 0 | 630 | 422 |
| 28 | Base | `8×␠ ↪️  ❖  Badge` | `119:2863` | 2 | 0 | 460 | 325 | 0 | 226 | 29 |
| 29 | Base | `8×␠ ↪️  ❖  Banner` | `224:2224` | 1 | 0 | 20 | 101 | 0 | 90 | 23 |
| 30 | Base | `8×␠ ↪️  ❖  Breadcrumbs` | `447:8760` | 2 | 0 | 18 | 189 | 0 | 108 | 60 |
| 31 | Base | `8×␠ ↪️  ❖  Button` | `129:605` | 5 | 0 | 648 | 1 211 | 0 | 525 | 204 |
| 32 | Base | `8×␠ ↪️  ❖  Button Group` | `225:2363` | 2 | 0 | 75 | 270 | 0 | 104 | 41 |
| 33 | Base | `8×␠ ↪️  ❖  Checkbox` | `227:1986` | 3 | 0 | 56 | 374 | 0 | 475 | 235 |
| 34 | Base | `8×␠ ↪️  ❖  Color Picker` | `553:22078` | 2 | 2 | 42 | 73 | 0 | 171 | 83 |
| 35 | Base | `8×␠ ↪️  ❖  Content Divider` | `414:4397` | 1 | 0 | 9 | 164 | 0 | 146 | 57 |
| 36 | Base | `8×␠ ↪️  ❖  Command Menu` | `4152:24764` | 2 | 1 | 27 | 478 | 0 | 573 | 322 |
| 37 | Base | `8×␠ ↪️  ❖  Date Picker` | `435:8548` | 5 | 0 | 22 | 668 | 0 | 262 | 128 |
| 38 | Base | `8×␠ ↪️  ❖  Drawer` | `486:7366` | 2 | 0 | 10 | 473 | 0 | 480 | 231 |
| 39 | Base | `8×␠ ↪️  ❖  Dropdown` | `166999:140904` | 2 | 0 | 66 | 540 | 0 | 332 | 41 |
| 40 | Base | `8×␠ ↪️  ❖  File Upload` | `450:9364` | 4 | 0 | 31 | 153 | 0 | 261 | 94 |
| 41 | Base | `8×␠ ↪️  ❖  Filter` | `3880:66172` | 4 | 0 | 7 | 624 | 0 | 562 | 257 |
| 42 | Base | `8×␠ ↪️  ❖  Key Components` | `263:1844` | 9 | 0 | 157 | 199 | 0 | 140 | 65 |
| 43 | Base | `8×␠ ↪️  ❖  Modal` | `466:4630` | 3 | 1 | 27 | 312 | 0 | 354 | 100 |
| 44 | Base | `8×␠ ↪️  ❖  Notification Feed` | `4096:21398` | 2 | 2 | 11 | 176 | 0 | 250 | 87 |
| 45 | Base | `8×␠ ↪️  ❖  Pagination` | `486:8465` | 2 | 0 | 11 | 395 | 0 | 224 | 45 |
| 46 | Base | `8×␠ ↪️  ❖  Progress Bar` | `450:17758` | 4 | 0 | 44 | 77 | 0 | 126 | 41 |
| 47 | Base | `8×␠ ↪️  ❖  Popover` | `553:22099` | 2 | 0 | 15 | 126 | 0 | 177 | 15 |
| 48 | Base | `8×␠ ↪️  ❖  Radio` | `515:3884` | 3 | 0 | 40 | 425 | 0 | 480 | 235 |
| 49 | Base | `8×␠ ↪️  ❖  Rating` | `532:4130` | 6 | 0 | 44 | 347 | 0 | 274 | 165 |
| 50 | Base | `8×␠ ↪️  ❖  Rich Editor` | `164611:20259` | 3 | 0 | 26 | 271 | 0 | 162 | 92 |
| 51 | Base | `8×␠ ↪️  ❖  Scroll` | `165475:768` | 1 | 0 | 6 | 20 | 0 | 51 | 18 |
| 52 | Base | `8×␠ ↪️  ❖  Select` | `270:1084` | 4 | 0 | 182 | 1 209 | 0 | 376 | 106 |
| 53 | Base | `8×␠ ↪️  ❖  Slider` | `2604:3416` | 2 | 0 | 16 | 99 | 0 | 235 | 84 |
| 54 | Base | `8×␠ ↪️  ❖  Step Indicator` | `479:14388` | 5 | 1 | 18 | 146 | 0 | 162 | 43 |
| 55 | Base | `8×␠ ↪️  ❖  Tab Menu` | `553:734` | 4 | 0 | 25 | 628 | 0 | 331 | 97 |
| 56 | Base | `8×␠ ↪️  ❖  Table` | `553:14955` | 3 | 0 | 72 | 1 444 | 0 | 578 | 116 |
| 57 | Base | `8×␠ ↪️  ❖  Tag` | `417:12348` | 1 | 0 | 96 | 172 | 0 | 190 | 49 |
| 58 | Base | `8×␠ ↪️  ❖  Text Area` | `434:6100` | 2 | 0 | 9 | 160 | 0 | 167 | 63 |
| 59 | Base | `8×␠ ↪️  ❖  Text Input` | `266:5230` | 5 | 0 | 264 | 1 990 | 0 | 652 | 97 |
| 60 | Base | `8×␠ ↪️  ❖  Time Picker` | `164611:83414` | 3 | 0 | 28 | 147 | 0 | 230 | 83 |
| 61 | Base | `8×␠ ↪️  ❖  Switch` | `379:6649` | 4 | 0 | 44 | 228 | 0 | 267 | 86 |
| 62 | Base | `8×␠ ↪️  ❖  Segmented Control` | `553:14953` | 2 | 0 | 15 | 234 | 0 | 219 | 44 |
| 63 | Base | `8×␠ ↪️  ❖  Tooltip` | `553:14954` | 1 | 0 | 48 | 178 | 0 | 434 | 107 |
| 64 | Sector | `✲  ・ Sector Products` | `294:10214` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 65 | Sector | `8×␠ ↪️  ❖  HR Management` | `3715:42038` | 6 | 1 | 37 | 5 207 | 1 | 3 624 | 700 |
| 66 | Sector | `8×␠ ↪️  ❖  Finance & Banking` | `3911:35677` | 0 | 0 | 0 | 3 760 | 0 | 2 566 | 757 |
| 67 | Sector | `8×␠ ↪️  ❖  Marketing & Sales` | `6696:81119` | 12 | 0 | 72 | 3 645 | 0 | 4 759 | 2 672 |
| 68 | Sector | `8×␠ ↪️  ❖  Cryptocurrency` | `6696:81120` | 18 | 30 | 107 | 3 395 | 2 | 4 447 | 3 059 |
| 69 | Sector | `8×␠ ↪️  ❖  AI Product` | `191042:2378` | 16 | 0 | 111 | 2 964 | 0 | 3 206 | 2 135 |
| 70 | Product | `✲  ・ Product Components` | `553:20480` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 71 | Product | `8×␠ ↪️  ❖  Navigation` | `3789:4743` | 11 | 0 | 61 | 440 | 2 | 240 | 0 |
| 72 | Product | `8×␠ ↪️  ❖  Page Headers` | `3829:27858` | 2 | 0 | 10 | 93 | 0 | 53 | 0 |
| 73 | Product | `8×␠ ↪️  ❖  Widgets` | `2950:5881` | 21 | 1 | 148 | 1 221 | 12 | 924 | 0 |
| 74 | Product | `8×␠ ↪️  ❖  Empty States` | `3860:4301` | 2 | 0 | 34 | 2 | 0 | 0 | 0 |
| 75 | Landing | `✲  ・ Landing Page` | `191267:11` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 76 | Landing | `8×␠ ↪️  ❖  Examples & Templates` | `191274:32191` | 0 | 0 | 0 | 5 394 | 0 | 9 724 | 80 |
| 77 | Landing | `8×␠ ↪️  ❖  Navigation` | `191360:9939` | 3 | 0 | 80 | 1 094 | 0 | 1 506 | 0 |
| 78 | Landing | `8×␠ ↪️  ❖  Announcements` | `191355:22699` | 1 | 0 | 36 | 103 | 0 | 136 | 0 |
| 79 | Landing | `8×␠ ↪️  ❖  Headers` | `191355:15521` | 1 | 0 | 20 | 674 | 0 | 1 005 | 0 |
| 80 | Landing | `8×␠ ↪️  ❖  Brand & Social Proof` | `191355:22265` | 1 | 0 | 18 | 211 | 0 | 431 | 0 |
| 81 | Landing | `8×␠ ↪️  ❖  Features` | `191355:22272` | 1 | 0 | 24 | 220 | 0 | 774 | 0 |
| 82 | Landing | `8×␠ ↪️  ❖  Stats & Metrics` | `191355:22700` | 1 | 0 | 20 | 173 | 0 | 339 | 0 |
| 83 | Landing | `8×␠ ↪️  ❖  How it works` | `191355:22361` | 1 | 0 | 24 | 327 | 0 | 657 | 0 |
| 84 | Landing | `8×␠ ↪️  ❖  Testimonials` | `191355:22529` | 1 | 0 | 20 | 149 | 0 | 388 | 0 |
| 85 | Landing | `8×␠ ↪️  ❖  Pricing` | `191355:22698` | 1 | 0 | 20 | 213 | 0 | 611 | 0 |
| 86 | Landing | `8×␠ ↪️  ❖  Integrations` | `191887:39798` | 1 | 0 | 24 | 257 | 0 | 474 | 0 |
| 87 | Landing | `8×␠ ↪️  ❖  Careers` | `191887:39799` | 1 | 0 | 22 | 351 | 0 | 745 | 0 |
| 88 | Landing | `8×␠ ↪️  ❖  Teams` | `191887:39800` | 1 | 0 | 32 | 545 | 0 | 791 | 0 |
| 89 | Landing | `8×␠ ↪️  ❖  Contact` | `191887:39801` | 1 | 0 | 36 | 333 | 0 | 758 | 0 |
| 90 | Landing | `8×␠ ↪️  ❖  Newsletter` | `191887:39802` | 2 | 0 | 41 | 171 | 0 | 518 | 0 |
| 91 | Landing | `8×␠ ↪️  ❖  CTA` | `191355:22530` | 2 | 0 | 46 | 284 | 0 | 490 | 0 |
| 92 | Landing | `8×␠ ↪️  ❖  FAQ` | `191355:22531` | 1 | 0 | 20 | 211 | 0 | 392 | 0 |
| 93 | Landing | `8×␠ ↪️  ❖  Blog` | `191355:22533` | 1 | 0 | 24 | 133 | 0 | 480 | 0 |
| 94 | Landing | `8×␠ ↪️  ❖  Footer` | `191355:22532` | 1 | 0 | 24 | 93 | 0 | 260 | 0 |
| 95 | Landing | `8×␠ ↪️  ❖  Assets [Landing]` | `191882:107044` | 8 | 4 | 90 | 84 | 0 | 192 | 0 |

## 16. Aneks dowodowy

### Foundations

| Zakres | Page ID | Główne węzły / dowód |
| --- | --- | --- |
| Color Palette | `553:14956` | Overview `2623:2287`, Token System `2645:344`, Guidelines `2675:1856` |
| Typography | `553:14957` | Overview `2697:307`, Guidelines `2708:673` |
| Icons | `41:136` | Overview `2716:25504`, Guidelines `2743:251`, 3 061 glyph masters |
| Grid System | `553:14958` | Overview `2762:1284`, Guidelines `2762:1583` |
| Shadows | `553:14959` | Overview `2767:1801`, Guidelines `2767:3102` |
| Motion | `553:14960` | Overview `2814:1329` |
| Corner Radius | `553:14961` | Overview `2839:908` |

### Próbki pogłębione

| Próbka | Page ID | Node ID | Dowód strukturalny | Screenshot kontrolny |
| --- | --- | --- | --- | --- |
| Button | `129:605` | `129:1422` | 384 warianty, osie i properties odczytane z mastera | wykonany, nieutrwalony |
| Text Input | `266:5230` | `266:5251` | 216 wariantów, 1 443 nested instances | wykonany, nieutrwalony |
| Checkbox | `227:1986` | `227:2002` | 24 warianty, selected/indeterminate/size | wykonany i zweryfikowany |
| Accordion | `210:4006` | `210:4022` | 6 wariantów, text/boolean/icon swap | wykonany i zweryfikowany |
| Finance | `3911:35677` | `3965:46276` | 66 instancji, 11 raw frames, 1440×900 | wykonany i zweryfikowany |
| Product Navigation | `3789:4743` | `3802:11759` | Sidebar: 6 wariantów i nested building blocks | dowód strukturalny |
| Landing Navigation | `191360:9939` | `191290:50634` | 48 wariantów głównego setu | dowód strukturalny |
| Features | `191355:22272` | `191424:10456` | 12 typów × desktop/mobile | dowód strukturalny |
| How it works | `191355:22361` | `191422:8134` | 24 warianty i pełna macierz node IDs | wykonany i zweryfikowany |
| CTA | `191355:22530` | `191434:15960`, `192516:10023` | 10 + 36 wariantów | dowód strukturalny |
| Template desktop | `191274:32191` | `193300:326049` | Hero, 1600×6262 | wykonany i zweryfikowany |
| Template mobile | `191274:32191` | `193737:120487` | Hero, 390×9234 | wykonany i zweryfikowany |

## 17. Kontrola kompletności

- [x] 95 unikalnych stron przypisanych dokładnie raz;
- [x] kategorie sumują się do 95;
- [x] 6 kolekcji i 376 Variables Align UI;
- [x] 34 Text, 27 Effect, 37 Paint i 4 Grid Styles Align UI;
- [x] MPCOM: 26 wszystkich stron i 12 stron rodzin komponentów;
- [x] MPCOM: 9 kolekcji, 383 Variables i Styles 23/2/0/1;
- [x] audyt kodu: 66 publicznych plików, 66 publicznych rekordów, 76 łącznie;
- [x] każda próbka ma page ID, node ID i dowód strukturalny lub screenshot;
- [x] obserwacje, interpretacje i rekomendacje są oznaczone;
- [x] rekomendacje zawierają problem, korzyść i priorytet;
- [x] raport nie kopiuje komponentów, treści ani API Align UI;
- [x] Figma, publiczne API Astro, komponenty, tokeny i roadmapa bez zmian.
