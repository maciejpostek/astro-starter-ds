# Variable Architecture & Design System Assumptions

## Cel Dokumentu

Ten dokument jest źródłem prawdy dla architektury zmiennych używanej w
uniwersalnym starterze Astro. Aktualizujemy go po przeanalizowaniu każdej
kolejnej kolekcji zmiennych.

System ma być:

- czytelny dla projektanta, developera i AI,
- możliwy do zastosowania w light i dark mode,
- wystarczająco szczegółowy, aby komponenty miały kompletne stany,
- wystarczająco prosty, aby można nim było zarządzać,
- przygotowany do eksploracji wizualnych poprzez zmianę tokenów zamiast
  przebudowy komponentów.

## Status

| Obszar | Status |
| --- | --- |
| Color Primitives | Założenia zatwierdzone |
| Color Semantic / Global | Założenia zatwierdzone |
| Color Semantic / Component | Założenia zatwierdzone |
| Light / dark mode | Mechanizm zatwierdzony |
| System statuses | Założenia zatwierdzone |
| Interaction states | Założenia zatwierdzone |
| Sizing Primitives | Architektura zatwierdzona, wartości do kalibracji |
| Sizing Semantic | Architektura zatwierdzona |
| Component Size | Profile `small`, `medium`, `large` zatwierdzone |
| Typography Foundations | Architektura zatwierdzona, wartości do kalibracji |
| Typography Semantic | Architektura zatwierdzona, wartości do kalibracji |
| Layout Foundations | Architektura zatwierdzona, wartości do kalibracji |
| Layout Semantic | Architektura zatwierdzona, wartości do kalibracji |

---

# 1. Model Architektury Tokenów

System zawiera trzy poziomy abstrakcji i warstwę implementacyjną:

```text
1. Reference tokens
   └── primitives

2. Semantic tokens
   ├── global semantics
   └── component semantics

3. Implementation
   └── CSS properties używające component tokens
```

Global semantics i component semantics są osobnymi namespace'ami. Component
semantics mogą aliasować global semantics lub, w określonych przypadkach,
reference primitives.

```text
primitive ───────────────→ global semantic
    │                            │
    └───────────────┐            │
                    ↓            ↓
                 component semantic
                          │
                          ↓
                    CSS component
```

## 1.1 Standardowa Ścieżka Aliasów

Stosowana, gdy komponent wykorzystuje rolę współdzieloną przez system:

```css
--color-neutral-950: #0a0a0a;

--color-text-inverse: var(--color-neutral-0);

--button-primary-text-default: var(--color-text-inverse);

.button[data-variant="primary"] {
  color: var(--button-primary-text-default);
}
```

## 1.2 Bezpośredni Alias Komponentu Do Primitive

Dozwolony, gdy wartość:

- jest specyficzna dla jednego komponentu,
- nie reprezentuje współdzielonej roli systemowej,
- nie uzasadnia dodania nowego global semantic tokena.

```css
--color-accent-600: oklch(62% 0.2 255);

--button-primary-background-hover: var(--color-accent-600);

.button[data-variant="primary"]:hover {
  background: var(--button-primary-background-hover);
}
```

## 1.3 Zasady Aliasowania

- Globalne tokeny semantyczne wskazują tokeny prymitywne.
- Token komponentowy wskazuje global semantic token, jeżeli oba tokeny mają
  identyczne znaczenie.
- Token komponentowy może wskazać primitive, jeżeli decyzja jest specyficzna
  dla komponentu.
- Nie tworzymy global semantic tokena wyłącznie po to, aby uniknąć
  bezpośredniego aliasu komponentu do primitive.
- Kod komponentu korzysta z component tokenów, gdy istnieje kontrakt danego
  komponentu. W przeciwnym razie może korzystać z global semantics.
- Reużywalny komponent nie korzysta bezpośrednio z primitives, poza świadomym
  wyjątkiem dla lokalnej geometrii bez odpowiedniej roli semantycznej.
- Alias jest wybierany na podstawie znaczenia, nie na podstawie chwilowo
  identycznej wartości koloru.
- Bezpośrednia wartość HEX może występować wyłącznie w primitives.

## 1.4 Kryterium Wyboru Aliasu

```text
Czy wartość reprezentuje istniejącą globalną rolę?
├── Tak → component token aliasuje global semantic token
└── Nie → czy wartość jest potrzebna wyłącznie komponentowi?
         ├── Tak → component token aliasuje primitive
         └── Nie → definiujemy nowy global semantic token
```

Component tokens nie są zagnieżdżone organizacyjnie wewnątrz global semantics.
Są osobną kolekcją i osobnym plikiem. Zależność między nimi wynika wyłącznie z
aliasu.

---

# 2. Color Primitives

## Rola

Color primitives przechowują surowe wartości palet. Nie opisują funkcji
koloru. Mogą być aliasowane przez global semantics oraz component semantics,
ale nie są używane bezpośrednio we właściwościach CSS komponentu.

```css
--color-neutral-0: #ffffff;
--color-neutral-50: #fafafa;
--color-neutral-500: #737373;
--color-neutral-950: #0a0a0a;

--color-accent-50: #f5f3ff;
--color-accent-500: #8b5cf6;
--color-accent-950: #2e1065;
```

## Zasady

- Każda paleta ma nazwę opisującą kolor, nie jego funkcję.
- `0` jest technicznym końcem skali neutralnej i oznacza czystą biel.
- `50` oznacza najjaśniejszy stopień właściwej rampy po czystej bieli.
- `500` jest głównym odcieniem palety.
- `950` oznacza bardzo ciemny szary znajdujący się blisko czerni.
- Przyjmujemy konwencję:
  `0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`.
- Liczba stopni może różnić się między paletami, jeżeli wynika to z realnej
  potrzeby.
- Używamy jednej pełnej palety `neutral` zamiast osobnych palet `light` i
  `dark`.
- Palety statusów mogą mieć własne skale, np. `success`, `warning`, `error` i
  `info`.
- Wartość `transparent` traktujemy jako prymityw techniczny.

## Spójność Pomiędzy Paletami

Numer odcienia ma oznaczać zbliżoną **rolę percepcyjną**, a nie matematycznie
identyczne nasycenie.

Przykładowo:

- `neutral/500` i `accent/500` powinny mieć zbliżony ciężar wizualny,
- `50` powinno zawsze działać jako bardzo jasna powierzchnia,
- `900` i `950` powinny zawsze działać jako bardzo ciemne kolory,
- ten sam stopień nie musi mieć identycznej wartości nasycenia dla żółtego,
  niebieskiego i szarego.

Palety budujemy w przestrzeni `OKLCH`, ponieważ pozwala ona kontrolować osobno:

```text
L — percepcyjną jasność,
C — chromę, czyli intensywność koloru,
H — hue, czyli jego odcień.
```

Wszystkie palety powinny korzystać ze wspólnej rampy jasności `L`. Chroma jest
dopasowywana do konkretnego hue oraz ograniczeń gamutu. Dzięki temu ten sam
numer ma podobną hierarchię wizualną, mimo że żółty i niebieski nie mogą mieć
identycznych parametrów i nadal wyglądać równie dobrze.

Nie generujemy palet poprzez mechaniczne rozjaśnianie i przyciemnianie koloru
HEX. Najpierw ustalamy wspólną rampę jasności, następnie kalibrujemy chromę i
sprawdzamy kontrast najważniejszych par semantycznych.

## Czego primitives nie robią

- Nie wiedzą, czy kolor jest tekstem, tłem lub borderem.
- Nie definiują wariantu komponentu.
- Nie definiują trybu light lub dark.
- Nie są przypisywane bezpośrednio do właściwości CSS komponentów.

---

# 3. Zakresy Semantyki Kolorów

## 3.1 Global Color Semantics

Opisują role działające w całym produkcie, niezależnie od komponentu.

Namespace:

```text
color.background.*
color.text.*
color.border.*
color.icon.*
color.status.*
color.state.*
```

W CSS:

```css
--color-background-canvas;
--color-text-primary;
--color-border-subtle;
--color-status-error-background;
--color-state-focus-ring;
```

## 3.2 Component Color Tokens

Opisują kolor konkretnej części, wariantu i stanu komponentu.

Namespace:

```text
component.[component].[variant].[property].[state]
```

W CSS pomijamy słowo `component`, ponieważ nazwa komponentu już wyznacza
namespace:

```css
--button-primary-background-default;
--button-primary-background-hover;
--button-primary-background-pressed;
--button-primary-text-disabled;

--input-border-default;
--input-border-focus;
--input-text-disabled;
```

## 3.3 Reguły Zakresu

- Global semantic token opisuje rolę niezależną od komponentu.
- Component token opisuje konkretną część, wariant i stan komponentu.
- Zmiana global semantic tokena aktualizuje wszystkie aliasujące go component
  tokens.
- Zmiana component tokena aktualizuje wyłącznie wskazany komponent.
- Nazwa tokena musi jednoznacznie określać jego zakres i przeznaczenie.

---

# 4. Globalne Role Kolorów

## 4.1 Reguły Nazewnictwa

- powierzchnie otrzymują nazwy funkcjonalne,
- tekst może zachować hierarchię `primary`, `secondary`, `tertiary`,
- warianty komponentów nadal mogą nazywać się `primary`, `secondary`,
  `tertiary`,
- każda nazwa hierarchiczna musi występować wewnątrz jednoznacznego namespace.

Prawidłowe nazwy:

```text
text/primary
button/primary/background/default
button/secondary/text/hover
```

Nieprawidłowa nazwa:

```text
color/primary
```

Token `color/primary` nie definiuje właściwości ani roli i nie może być używany
w systemie.

## 4.2 Background

```text
background/canvas
background/surface
background/subtle
background/muted
background/strong
background/inverse
background/accent-subtle
background/accent
background/accent-strong
background/overlay
background/media-overlay
```

### Definicje

| Token | Funkcja |
| --- | --- |
| `canvas` | Główne tło strony lub aplikacji. Największa powierzchnia. |
| `surface` | Domyślna neutralna powierzchnia komponentu, panelu lub sekcji. |
| `subtle` | Powierzchnia wymagająca delikatnego odróżnienia od otoczenia. |
| `muted` | Powierzchnia celowo obniżona w hierarchii lub wyciszona. |
| `strong` | Mocniejsza neutralna powierzchnia, np. stan hover po `muted`. |
| `inverse` | Powierzchnia o odwróconym kontraście wobec canvasu. |
| `accent-subtle` | Akcentowa powierzchnia o najniższym nacisku. |
| `accent` | Domyślna akcentowa powierzchnia wykorzystująca kolor marki. |
| `accent-strong` | Akcentowa powierzchnia o najwyższym nacisku. |
| `overlay` | Ogólna półprzezroczysta warstwa nakładana nad interfejsem. |
| `media-overlay` | Mocniejsza nakładka zapewniająca kontrast treści na mediach. |

### Reguły Użycia Powierzchni

- Tokeny powierzchni nie definiują obowiązkowego zagnieżdżenia.
- `surface`, `subtle`, `muted` i `strong` mogą występować na dowolnym poziomie
  layoutu, jeżeli ich rola odpowiada definicji.
- Poziomy `accent-subtle`, `accent` i `accent-strong` opisują nacisk, a nie
  stały kierunek numerów palety; ich aliasy odwracają się w dark mode.
- `subtle` nie musi znajdować się wewnątrz `surface`.
- Jeden element otrzymuje token na podstawie swojej roli, nie na podstawie
  tokena użytego przez rodzica.
- Kontrast elementów wewnętrznych jest weryfikowany względem rzeczywistego
  backgroundu, a nie wyprowadzany z podobnej nazwy tokena.
- Tokeny opisują przeznaczenie i nie narzucają struktury DOM.

Przykłady poprawnego zastosowania:

```text
body                         → background/canvas
sidebar                      → background/surface
niezależna sekcja pomocnicza → background/subtle
wyciszony rekord tabeli      → background/muted
hover neutralnego switcha    → background/strong
ciemna sekcja CTA            → background/inverse
delikatny brandowy panel     → background/accent-subtle
brandowy banner              → background/accent
aktywny brandowy control     → background/accent-strong
modal backdrop               → background/overlay
tekst na zdjęciu             → background/media-overlay
```

## 4.3 Text

```text
text/primary
text/secondary
text/tertiary
text/inverse
text/accent
```

### Definicje

| Token | Funkcja |
| --- | --- |
| `primary` | Główna treść i nagłówki wymagające najwyższej czytelności. |
| `secondary` | Tekst wspierający, opisy i mniej istotne informacje. |
| `tertiary` | Metadane, placeholdery i treści o najniższej hierarchii. |
| `inverse` | Tekst umieszczony na powierzchni `inverse` lub ciemnym akcencie. |
| `accent` | Tekst służący do brandowego wyróżnienia. |

## 4.4 Border

```text
border/subtle
border/default
border/strong
border/inverse
border/accent-subtle
border/accent
border/accent-strong
border/on-media
```

### Definicje

| Token | Funkcja |
| --- | --- |
| `subtle` | Najdelikatniejszy podział struktury. |
| `default` | Standardowy border komponentu. |
| `strong` | Wyraźne oddzielenie lub podkreślenie hierarchii. |
| `inverse` | Border na powierzchniach o odwróconym kontraście. |
| `accent-subtle` | Najdelikatniejsze akcentowe obramowanie. |
| `accent` | Domyślne akcentowe wyróżnienie lub zaznaczenie. |
| `accent-strong` | Najmocniejsze akcentowe obramowanie. |
| `on-media` | Półprzezroczyste obramowanie elementu umieszczonego na mediach. |

Neutralne role borderów współdzielą wartości z powierzchniami:

```text
border/subtle  = background/subtle
border/default = background/muted
border/strong  = background/strong
```

Trzy role akcentowe borderów odpowiadają bezpośrednio trzem rolom akcentowym
backgroundów w każdym trybie kolorystycznym.

## 4.5 Icon

Ikony powinny domyślnie dziedziczyć `currentColor`. Osobne tokeny ikon stosujemy
tylko wtedy, gdy ikona ma inną rolę niż towarzyszący jej tekst.

```text
icon/primary
icon/secondary
icon/tertiary
icon/inverse
icon/accent
```

## 4.6 Słowniki Ról

Każda grupa ma tę samą **strukturę techniczną**:

```text
color / property / role
```

Nie musi jednak mieć identycznego słownika ról, ponieważ każda właściwość
rozwiązuje inny problem:

- background opisuje rodzaj powierzchni,
- text i icon opisują hierarchię treści,
- border opisuje siłę podziału,
- status opisuje znaczenie komunikatu,
- state opisuje stan zachowania.

System zachowuje wspólną gramatykę nazw i stosuje słownik ról właściwy dla
każdej właściwości.

## 4.7 Pełna Mapa Globalnych Semantics

```text
color/
├── background/
│   ├── canvas
│   ├── surface
│   ├── subtle
│   ├── muted
│   ├── inverse
│   └── accent
│
├── text/
│   ├── primary
│   ├── secondary
│   ├── tertiary
│   ├── inverse
│   └── accent
│
├── border/
│   ├── subtle
│   ├── default
│   ├── strong
│   ├── inverse
│   └── accent
│
├── icon/
│   ├── primary
│   ├── secondary
│   ├── tertiary
│   ├── inverse
│   └── accent
│
├── status/
│   ├── success/
│   │   ├── background
│   │   ├── border
│   │   ├── text
│   │   └── icon
│   ├── warning/ [background, border, text, icon]
│   ├── error/   [background, border, text, icon]
│   └── info/    [background, border, text, icon]
│
└── state/
    ├── disabled/
    │   ├── background
    │   ├── border
    │   ├── text
    │   └── icon
    └── focus/
        ├── ring
        └── ring-offset
```

`state/disabled/*` jest jedynym globalnym źródłem tokenów disabled.

## 4.8 Accent

`accent` opisuje kolor brandowy i wizualne wyróżnienie. Nie oznacza
automatycznie interakcji.

Może być używany przez:

- dekoracyjne linie i markery,
- wyróżnione bordery,
- selected state,
- ikony brandowe,
- akcentowane powierzchnie,
- komponenty CTA poprzez ich własne tokeny.

Globalna grupa `interactive` nie jest częścią bieżącej architektury. Grupa
`action` może zostać dodana, gdy co najmniej trzy komponenty będą współdzielić
identyczną rolę i kontrakt kolorystyczny akcji.

---

# 5. Proporcje Kolorów

Proporcje są zasadą kompozycyjną, nie nazwą techniczną tokenów.

Punkt wyjścia dla eksploracji:

```text
60% canvas i dominujące powierzchnie
30% surface, subtle i muted
10% accent, inverse i kluczowe wyróżnienia
```

## Zasady

- Proporcja opisuje oczekiwaną obecność koloru w całym widoku.
- Nie musi być matematycznie identyczna na każdej podstronie.
- `accent` powinien pozostać ograniczony, aby zachować hierarchię.
- `inverse` może chwilowo zajmować większą powierzchnię w sekcji specjalnej,
  ale nie powinien bez powodu dominować nad canvasem.
- Komponenty korzystają z nazw funkcjonalnych, nie z nazw `60`, `30` i `10`.

Nazwa tokena definiuje jego rolę. Reguła kompozycyjna definiuje oczekiwaną
częstotliwość użycia.

---

# 6. Light I Dark Mode

## Zasada

API tokenów semantycznych i komponentowych pozostaje identyczne. Zmieniają się
wyłącznie wskazane tokeny prymitywne.

```css
:root,
[data-theme="light"] {
  --color-background-canvas: var(--color-neutral-50);
  --color-background-surface: var(--color-neutral-100);
  --color-text-primary: var(--color-neutral-950);
}

[data-theme="dark"] {
  --color-background-canvas: var(--color-neutral-950);
  --color-background-surface: var(--color-neutral-900);
  --color-text-primary: var(--color-neutral-50);
}
```

## Konsekwencje

- Komponent nie wie, który mode jest aktywny.
- Przełączenie theme'u nie zmienia nazw używanych przez komponent.
- Component token aliasujący global semantic token automatycznie dziedziczy
  zmianę theme'u.
- Component token aliasujący primitive zachowuje tę samą wartość w obu
  theme'ach, chyba że zostanie zdefiniowany osobno dla każdego theme'u.
- Atrybut `data-theme` może być ustawiony na całym dokumencie lub lokalnej
  sekcji.
- Lokalny dark section może istnieć wewnątrz strony działającej w light mode.
- Primitives nie zmieniają wartości między trybami.
- Każdy theme musi przejść osobną kontrolę kontrastu i dostępności.

Component-specific wartość zależna od theme'u jest deklarowana w obu zakresach:

```css
[data-theme="light"] {
  --button-primary-background-hover: var(--color-accent-600);
}

[data-theme="dark"] {
  --button-primary-background-hover: var(--color-accent-400);
}
```

Global semantic alias jest używany, gdy komponent ma dziedziczyć wspólną
decyzję theme'u. Primitive alias jest używany, gdy decyzja pozostaje lokalna
dla komponentu.

---

# 7. Statusy Systemowe

Status opisuje znaczenie komunikatu, nie stan interakcji.

```text
status/success/*
status/warning/*
status/error/*
status/info/*
```

Każdy status ma ten sam kontrakt:

```text
background
border
text
icon
```

Przykład:

```css
--color-status-error-background;
--color-status-error-border;
--color-status-error-text;
--color-status-error-icon;
```

## Zastosowanie

- alerty,
- validation messages,
- status badges,
- komunikaty formularzy,
- oznaczenia sukcesu, błędu, ostrzeżenia i informacji.

Komponent statusowy aliasuje globalne tokeny statusu. Component-specific status
token jest dozwolony wyłącznie wtedy, gdy komponent wymaga innego kontraktu lub
hierarchii.

---

# 8. Stany Interakcji

## Zakres Stanów

Globalny kolor `hover`, `pressed` lub `selected` nie jest częścią
architektury. Te stany są definiowane w namespace komponentu, ponieważ ich
wartość zależy od wariantu i właściwości komponentu.

## Podział stanów

### Globalnie reużywane

```text
state/focus/ring
state/focus/ring-offset

state/disabled/background
state/disabled/border
state/disabled/text
state/disabled/icon
```

Tokeny są globalne, ponieważ ich znaczenie i wymagania dostępnościowe są
systemowe.

`focus` nie posiada globalnego backgroundu ani tekstu. Globalny kontrakt
obejmuje ring i ring-offset. Komponent może aliasować własny `border/focus` do
globalnego koloru focusu.

### Definiowane w komponencie

```text
default
hover
pressed
selected
```

Są zależne od wariantu komponentu.

## Precyzyjne znaczenia

| Stan | Znaczenie |
| --- | --- |
| `default` | Stan spoczynkowy komponentu. |
| `hover` | Wskaźnik znajduje się nad elementem. |
| `pressed` | Przejściowy stan podczas aktywacji przycisku lub kontrolki. |
| `selected` | Trwały wybór, np. aktywny tab, tag lub element nawigacji. |
| `focus` | Element ma focus klawiatury; używamy głównie `focus-visible`. |
| `disabled` | Element jest niedostępny i nie przyjmuje interakcji. |

Nie używamy ogólnego `active`, ponieważ w CSS i języku projektowym może
oznaczać zarówno `pressed`, jak i `selected`.

## Aliasowanie stanów globalnych

Komponent może wskazać token globalny:

```css
--button-primary-background-disabled:
  var(--color-state-disabled-background);
--button-primary-text-disabled:
  var(--color-state-disabled-text);
--button-focus-ring:
  var(--color-state-focus-ring);
```

Jeżeli dany komponent wymaga innego disabled state, może nadpisać alias na
poziomie component token, ale wyjątek powinien być świadomy.

---

# 9. Component Color Tokens

## Kontrakt

Token komponentowy powinien określać:

```text
component
variant
property
state
```

Przykład buttona:

```text
button/primary/background/default
button/primary/border/default
button/primary/text/default

button/primary/background/hover
button/primary/border/hover
button/primary/text/hover

button/primary/background/pressed
button/primary/border/pressed
button/primary/text/pressed

button/primary/background/disabled
button/primary/border/disabled
button/primary/text/disabled

button/focus/ring
button/focus/ring-offset
```

## 9.1 Button

Button ma warianty określające jego hierarchię:

```text
button/
├── primary/
├── secondary/
└── link/
```

Każdy wariant korzysta z tego samego kontraktu właściwości i stanów:

```text
button/{variant}/
├── background/
│   ├── default
│   ├── hover
│   ├── pressed
│   └── disabled
├── border/
│   ├── default
│   ├── hover
│   ├── pressed
│   └── disabled
├── text/
│   ├── default
│   ├── hover
│   ├── pressed
│   └── disabled
└── icon/
    ├── default
    ├── hover
    ├── pressed
    └── disabled

button/focus/
├── ring
└── ring-offset
```

Primary, secondary i link zachowują tę samą strukturę. Każdy token może
aliasować global semantic token lub primitive zgodnie z regułami z sekcji 1.3.

Zwykły button nie posiada stanu `selected`. Toggle button rozszerza kontrakt o
`selected`.

## 9.2 Input

Input nie potrzebuje wariantów `primary`, `secondary`, `tertiary`, jeżeli nie
istnieją one realnie w projekcie. Jego struktura opisuje części kontrolki:

```text
input/
├── background/
│   ├── default
│   ├── hover
│   ├── focus
│   └── disabled
├── border/
│   ├── default
│   ├── hover
│   ├── focus
│   ├── invalid
│   ├── valid
│   └── disabled
├── text/
│   ├── default
│   └── disabled
├── placeholder/
│   ├── default
│   └── disabled
├── icon/
│   ├── default
│   └── disabled
├── label/
│   ├── default
│   └── disabled
├── helper/
│   ├── default
│   ├── invalid
│   └── valid
└── focus/
    ├── ring
    └── ring-offset
```

`invalid` aliasuje status `error`, a `valid` status `success`. Tokeny `valid`
powstają tylko wtedy, gdy interfejs komunikuje pozytywną walidację.

## 9.3 Tab

Tab reprezentuje trwały wybór i posiada stan `selected`. Stan `pressed` jest
dodawany wyłącznie wtedy, gdy interfejs definiuje dla niego osobną prezentację:

```text
tab/
├── background/
│   ├── default
│   ├── hover
│   ├── selected
│   └── disabled
├── border/
│   ├── default
│   ├── hover
│   ├── selected
│   └── disabled
├── text/
│   ├── default
│   ├── hover
│   ├── selected
│   └── disabled
├── icon/
│   ├── default
│   ├── hover
│   ├── selected
│   └── disabled
└── focus/
    ├── ring
    └── ring-offset
```

## 9.4 Pozostałe Komponenty

Każdy komponent otrzymuje wyłącznie stany zgodne z jego zachowaniem:

| Komponent | Typowe stany |
| --- | --- |
| Button | default, hover, pressed, focus, disabled |
| Toggle button | default, hover, pressed, selected, focus, disabled |
| Link | default, hover, focus, opcjonalnie visited |
| Input | default, hover, focus, invalid, valid, disabled |
| Tab | default, hover, selected, focus, disabled |
| Checkbox | default, hover, checked, indeterminate, focus, disabled |
| Tag statyczny | default |
| Tag interaktywny | default, hover, selected, focus, disabled |
| Card statyczna | default |
| Card interaktywna | default, hover, selected, focus, disabled |

Kontrakt stanów jest definiowany osobno dla każdego komponentu zgodnie z jego
zachowaniem.

## Zasada minimalnego zestawu

Nie każdy komponent musi otrzymać wszystkie możliwe tokeny. Dodajemy tylko:

- właściwości, które komponent faktycznie posiada,
- stany, które komponent faktycznie obsługuje,
- warianty, które istnieją w produkcie.

Przykłady:

- Label bez interakcji nie potrzebuje hover ani pressed.
- Eyebrow może potrzebować tylko text, icon, background i border.
- Link potrzebuje default, hover, focus i visited tylko wtedy, gdy visited
  jest istotny.
- Tab potrzebuje default, hover, selected, focus i disabled.
- Input potrzebuje default, hover, focus, invalid, valid i disabled.

Token bez istniejącego zastosowania nie jest dodawany do systemu.

---

# 10. Walidacja Formularzy A Statusy

`success`, `warning` i `error` nie są globalnymi stanami interakcji. Są
statusami systemowymi.

Dla inputów stosujemy semantyczne stany:

```text
input/background/default
input/background/hover
input/background/focus
input/background/disabled

input/border/default
input/border/hover
input/border/focus
input/border/invalid
input/border/valid
input/border/disabled

input/helper/default
input/helper/invalid
input/helper/valid
```

`invalid` może aliasować `status/error`, a `valid` może aliasować
`status/success`.

```css
--input-border-invalid: var(--color-status-error-border);
--input-text-invalid: var(--color-status-error-text);
--input-border-valid: var(--color-status-success-border);
```

---

# 11. Struktura W Kodzie

Tokeny kolorów są rozdzielone na:

```text
src/styles/tokens/
  color-primitives.css
  color-semantic.css
  color-components.css
```

## `color-primitives.css`

- surowe palety,
- brak light/dark mode,
- brak zależności od komponentów.

## `color-semantic.css`

- globalne role,
- light/dark mode,
- statusy,
- focus i disabled.

## `color-components.css`

- aliasy dla komponentów,
- warianty,
- stany komponentów.

---

# 12. Zatwierdzone Decyzje

- Primitives są jedynym miejscem przechowującym surowe wartości kolorów.
- Kod komponentu korzysta z component tokenów, gdy istnieje kontrakt danego
  komponentu; w pozostałych przypadkach może korzystać z global semantics.
- Component token domyślnie aliasuje odpowiadający mu global semantic token.
- Component token może aliasować primitive, gdy decyzja jest specyficzna dla
  jednego komponentu i nie istnieje właściwa globalna rola.
- Component tokens i global semantics są osobnymi namespace'ami oraz osobnymi
  plikami.
- Light i dark mode mają identyczne API tokenów.
- Theme jest przełączany przez atrybut `data-theme`.
- Theme może działać globalnie lub lokalnie na sekcji.
- Statusy `success`, `warning`, `error` i `info` mają `background`, `border`,
  `text` i `icon`.
- Accent jest rolą brandową, nie automatycznie interaktywną.
- Hover, pressed i selected są definiowane na poziomie komponentów.
- Focus i disabled mają globalne podstawy reużywane przez komponenty.
- Nie używamy wieloznacznego `active`; rozdzielamy `pressed` i `selected`.
- Proporcja 60/30/10 jest regułą kompozycyjną, nie nazwą tokenów.
- Powierzchnie używają ról `canvas`, `surface`, `subtle`, `muted`, `inverse`,
  `accent`.
- Tokeny powierzchni nie narzucają zagnieżdżenia ani struktury DOM.
- Używamy jednej palety neutralnej od `neutral/0` do `neutral/950`.
- `neutral/0` jest czystą bielą, a `neutral/950` bardzo ciemnym szarym blisko
  czerni.
- Palety kolorów będą kalibrowane w `OKLCH` poprzez wspólną rampę jasności.
- Nie tworzymy na tym etapie globalnej grupy `action` lub `interactive`.
- Zaczynamy od jednego globalnego zestawu tokenów `disabled`.
- W kodzie używamy krótkiej nazwy `info`.
- Statusy systemowe i disabled posiadają kontrakt `background`, `border`,
  `text`, `icon`.
- Globalny focus posiada `ring` i `ring-offset`; pozostałe zmiany focusu
  definiuje komponent.

---

# 13. Architektura Tokenów Sizingowych

## 13.1 Model Warstw

Sizing korzysta z następującego przepływu:

```text
Size primitives
      ↓
Global size semantics
      ↓
Shared foundations lub component size tokens
      ↓
CSS properties
```

```text
size primitive
├──→ global semantic
│        ├──→ shared control foundation
│        │          └──→ component token
│        └──────────────→ component token
└───────────────────────→ component token
```

Global semantics opisują role współdzielone przez wiele sekcji lub
komponentów. Component tokens opisują konkretne właściwości pojedynczego
komponentu.

## 13.2 Size Primitives

Size primitives przechowują wyłącznie stałe wartości wymiarów.

Primitive token:

- ma jedną wartość,
- nie zawiera `clamp()`,
- nie zmienia się na breakpointach,
- nie zawiera informacji o zastosowaniu,
- jest zapisany w `rem`, z wyjątkiem wartości `0`,
- może być aliasowany przez global semantic lub component token.

Przykład:

```css
:root {
  --size-0: 0;
  --size-1: 0.0625rem;
  --size-2: 0.125rem;
  --size-4: 0.25rem;
  --size-8: 0.5rem;
  --size-12: 0.75rem;
  --size-16: 1rem;
  --size-20: 1.25rem;
  --size-24: 1.5rem;
  --size-32: 2rem;
  --size-48: 3rem;
  --size-64: 4rem;
  --size-96: 6rem;
  --size-128: 8rem;
  --size-256: 16rem;
}
```

Nazwa tokena odpowiada jego ekwiwalentowi przy bazowym `1rem = 16px`.
`--size-32` zawsze oznacza `2rem`. Nie może na mniejszym viewportcie zmienić
się w `22px`.

### Robocza Skala

```text
0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80,
96, 112, 128, 160, 192, 256
```

Skala jest gęstsza przy małych wartościach i rzadsza przy dużych. Finalny
zestaw zostanie skalibrowany podczas implementacji. Wartości wynikające
wyłącznie z typografii nie są automatycznie dodawane do tej skali.

## 13.3 Global Size Semantics

Global size semantics opisują role niezależne od konkretnego komponentu.

```text
size/
├── section-padding/
│   ├── compact
│   ├── default
│   ├── large
│   └── hero-top
│
├── component-padding/
│   ├── small
│   ├── medium
│   └── large
│
├── gap/
│   ├── small
│   ├── medium
│   └── large
│
├── radius/
│   ├── none
│   ├── small
│   ├── medium
│   ├── large
│   └── full
│
└── border-width/
    ├── default
    └── strong
```

### Section Padding

`section-padding/hero-top` utrzymuje spójny górny padding sekcji hero w całym
serwisie.

```css
:root {
  --section-padding-default:
    clamp(var(--size-48), 2rem + 3vw, var(--size-96));

  --section-padding-hero-top:
    clamp(var(--size-64), 2rem + 5vw, var(--size-128));
}
```

Nie tworzymy globalnych tokenów nazwanych od konkretnego projektu, treści lub
klienta. Wyjątek specyficzny dla pojedynczego hero należy do component tokens
tego hero.

### Component Padding

Globalne component padding tokens opisują powtarzalny wewnętrzny spacing
neutralnych komponentów:

```css
:root {
  --component-padding-small: var(--size-12);
  --component-padding-medium: var(--size-24);
  --component-padding-large:
    clamp(var(--size-24), 1rem + 2vw, var(--size-40));
}
```

Komponent może aliasować globalny token albo zdefiniować własny, jeżeli jego
geometria wymaga innego zachowania.

### Gap

Gap opisuje relację pomiędzy elementami w flexie lub gridzie:

```css
:root {
  --gap-small: var(--size-8);
  --gap-medium: clamp(var(--size-12), 0.5rem + 1vw, var(--size-24));
  --gap-large: clamp(var(--size-24), 1rem + 2vw, var(--size-48));
}
```

Nie tworzymy globalnej skali margin jako kopii skali spacingu. Relacje
pomiędzy elementami są domyślnie obsługiwane przez `gap`, a przestrzeń
wewnętrzna przez padding. Margin może wystąpić w tokenach komponentowych lub
w systemie vertical rhythm typografii, gdy ma określoną funkcję.

## 13.4 Shared Component Size Profiles

Button, input, select, tab, tag, label i eyebrow mogą współdzielić bazowe
profile geometrii. System definiuje trzy profile rozmiaru:

```text
component-size/
├── small/
│   ├── min-height
│   ├── padding-inline
│   ├── padding-block
│   ├── icon-size
│   ├── gap
│   ├── font-size
│   └── line-height
├── medium/
│   └── ...
└── large/
    └── ...
```

Przykład:

```css
:root {
  --component-size-medium-min-height: var(--size-48);
  --component-size-medium-padding-inline: var(--size-20);
  --component-size-medium-padding-block: var(--size-12);
  --component-size-medium-icon-size: var(--size-20);
  --component-size-medium-gap: var(--size-8);
  --component-size-medium-font-size: var(--font-size-body-base);
  --component-size-medium-line-height: var(--line-height-none);
}
```

Rozmiar jest wybierany przez atrybut HTML. Atrybut udostępnia komponentowi
stabilne, lokalne aliasy:

```css
[data-component-size="medium"] {
  --component-min-height: var(--component-size-medium-min-height);
  --component-padding-inline: var(--component-size-medium-padding-inline);
  --component-padding-block: var(--component-size-medium-padding-block);
  --component-icon-size: var(--component-size-medium-icon-size);
  --component-gap: var(--component-size-medium-gap);
  --component-font-size: var(--component-size-medium-font-size);
  --component-line-height: var(--component-size-medium-line-height);
}
```

```html
<button data-component-size="small">Action</button>
<input data-component-size="medium" />
```

Komponent konsumuje lokalne aliasy. Własne decyzje, takie jak font-weight,
kolor, border i zachowanie, pozostają częścią CSS konkretnego komponentu.
Nie każdy komponent musi obsługiwać wszystkie profile. `small` jest
przeznaczony głównie dla kompaktowych kontrolek, tagów, labeli i metadanych, a
pola formularza korzystają domyślnie z `medium` lub `large`.

### Tag Usage Rule

`Tag` jest domyślnym komponentem dla krótkich wartości kategoryzujących:
zakresów usług, etapów procesu, aktywności, stacku technologicznego, branż,
metadanych projektu i podobnych grup pojęć. Nie tworzymy lokalnych list ani
lokalnie stylowanych `span` / `li`, jeżeli element pełni rolę taga.

Domyślny rozmiar taga w interfejsie to `small`. Większe rozmiary taga mogą
pojawić się wyłącznie jako świadoma decyzja dla konkretnego wzorca UI, a nie
jako lokalny wyjątek wynikający z miejsca użycia.

## 13.5 Component-specific Size Decisions

Token specyficzny dla komponentu powstaje dopiero wtedy, gdy współdzielony
profil lub globalna semantyka nie opisują jego rzeczywistej roli. Karty, modale
i sekcje korzystają bezpośrednio z globalnych `component-padding-*`,
`section-padding-*` i `gap-*`. Lokalny token pozostaje przy implementacji
komponentu, dopóki nie zostanie potwierdzone jego ponowne użycie.

## 13.6 Strategie Responsywności

Każdy semantic lub component token wybiera jeden z trzech modeli.

### Fixed

Token zachowuje tę samą wartość na wszystkich viewportach:

```css
:root {
  --component-size-medium-min-height: var(--size-48);
  --border-width-default: var(--size-1);
  --component-size-medium-icon-size: var(--size-20);
}
```

Fixed jest właściwy dla wymiarów, które wymagają stabilności, między innymi
border width, touch target, wysokości części kontrolek i małe ikony.

### Fluid

Token zawiera `clamp()` bezpośrednio w warstwie semantic lub component:

```css
:root {
  --section-padding-hero-top:
    clamp(var(--size-64), 2rem + 5vw, var(--size-128));

  --gap-large:
    clamp(var(--size-24), 1rem + 2vw, var(--size-48));
}
```

Nie tworzymy osobnej kolekcji ani namespace'u `fluid/64-128`. `Fluid` jest
sposobem zachowania tokena, a nie osobnym poziomem architektury.

Clamp jest stosowany, gdy wartość powinna płynnie rosnąć pomiędzy minimum i
maximum, szczególnie dla dużych odstępów sekcji, dużych gapów i wybranych
paddingów.

### Responsive Override

Token otrzymuje inną stałą wartość na breakpointcie:

```css
:root {
  --component-padding-medium: var(--size-24);
  --component-size-large-min-height: var(--size-56);
}

@media (width < 48rem) {
  :root {
    --component-padding-medium: var(--size-16);
    --component-size-large-min-height: var(--size-48);
  }
}
```

Responsive override jest stosowany, gdy potrzebny jest kontrolowany skok, a
interpolacja dawałaby niepożądane wartości pośrednie.

## 13.7 Media Queries I Container Queries

Globalne responsive overrides są grupowane w pliku tokenów:

```css
:root {
  /* Default semantic values */
}

@media (width < 48rem) {
  :root {
    /* Global semantic overrides */
  }
}
```

Komponenty korzystające z tych tokenów nie potrzebują własnych media queries.
Jedno centralne media query może zmienić wiele globalnych ról.

Container query jest stosowane, gdy zachowanie zależy od szerokości komponentu,
a nie od szerokości viewportu:

```css
@container (width < 30rem) {
  .card {
    --card-padding: var(--size-16);
  }
}
```

Zasady:

- `clamp()` obsługuje płynne zmiany bez media query,
- media query obsługuje globalny skok zależny od viewportu,
- container query obsługuje lokalny skok zależny od szerokości komponentu,
- media queries nie są powielane w komponentach, jeżeli zmianę można
  przeprowadzić przez global semantic token,
- lokalny override jest dodawany tylko wtedy, gdy komponent ma własne
  wymaganie responsywne.

Wartości breakpointów oraz zakres viewportu używany do kalibracji `clamp()`
należą do tokenów layoutu i site settings. Nie są definiowane w size
primitives.

## 13.8 Kryterium Wyboru Zachowania

```text
Czy wartość powinna zmieniać się responsywnie?
├── Nie → fixed primitive lub fixed semantic token
└── Tak
    ├── Czy powinna zmieniać się płynnie?
    │   └── Tak → clamp() w semantic lub component token
    └── Czy wymaga kontrolowanego skoku?
        ├── Zależy od viewportu → media query
        └── Zależy od szerokości komponentu → container query
```

## 13.9 Struktura W Kodzie

```text
src/styles/tokens/
  size-primitives.css
  size-semantic.css
  component-sizes.css
```

`size-primitives.css` zawiera stałą skalę. `size-semantic.css` zawiera globalne
role, `clamp()` i centralne responsive overrides. `component-sizes.css`
zawiera współdzielone profile `small`, `medium`, `large` oraz
mapowanie `data-component-size` na lokalne aliasy komponentu.

---

# 14. Architektura Tokenów Typograficznych

## 14.1 Model Warstw

```text
Typography foundations
        ↓
Semantic typography tokens
        ↓
CSS text styles i komponenty
```

Typography foundations przechowują pojedyncze wartości. Semantic typography
tokens składają te wartości w kompletne style tekstowe. Component typography
tokens aliasują odpowiedni semantic style lub jego wybrane właściwości.

Nazwa `Foundations` jest świadoma: warstwa łączy wartości referencyjne z
kontrolnymi punktami posiadającymi role, takimi jak `heading`, `body`, `normal`
czy `strong`. Nie jest więc wyłącznie surową rampą prymitywów. Z tego powodu nie
zmieniamy jej na `Typography Primitives` tylko dla zgodności z ograniczeniami
innego narzędzia.

## 14.2 Font Family

Font nagłówków i font tekstów są definiowane jako osobne role:

```css
:root {
  --font-family-heading: "Inter", Arial, sans-serif;
  --font-family-body: "Inter", Arial, sans-serif;
  --font-family-mono: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
}
```

Zasady:

- nagłówki aliasują `font-family-heading`,
- paragrafy i teksty interfejsu aliasują `font-family-body`,
- obie główne role wskazują obecnie font Inter dostarczany przez
  `@fontsource/inter`,
- role mogą zostać zmienione niezależnie podczas eksploracji na osobnych
  branchach,
- zmiana fonta nie wymaga edycji semantic ani component typography tokens,
- `font-family-mono` jest wewnętrzną zależnością dokumentacji i code snippetów;
  nie jest publiczną rolą typograficzną ani standardową zmienną eksportowaną
  do Figmy; Paper może przechować nieużywany token techniczny dla jawnego code
  snippetu,
- w Figmie i Paper font mono może zostać użyty wyłącznie lokalnie w jawnym
  przykładzie lub komponencie code snippet; nie stosujemy go do captionów,
  metadanych, labeli ani zwykłego tekstu interfejsu,
- fallbacki są częścią wartości font-family foundation.

## 14.3 Font Weight

System wykorzystuje maksymalnie trzy role grubości:

```text
font-weight/
├── normal
├── emphasis
└── strong
```

Przykładowe mapowanie:

```css
:root {
  --font-weight-normal: 400;
  --font-weight-emphasis: 500;
  --font-weight-strong: 600;
}
```

Nazwy opisują funkcję w hierarchii, a nie nazwę weightu dostępną w konkretnym
foncie. Po wyborze fonta wartości mogą zostać zmapowane inaczej:

```text
normal   → Regular, Book lub inny podstawowy weight
emphasis → Medium, Semibold lub inny weight pośredni
strong   → Semibold, Bold lub inny najmocniejszy używany weight
```

Zmiana mapowania odbywa się wyłącznie w foundations. Semantic styles i
komponenty nie używają surowych wartości `400`, `500`, `600`.

## 14.4 Font Size

Font sizes mają własną semantyczną skalę. Nie aliasują automatycznie
uniwersalnych size primitives.

```text
font-size/
├── h1
├── h2
├── h3
├── h4
├── h5
├── h6
├── body-large
├── body-medium
├── body-base
├── body-small
└── body-tiny
```

Nazwy tokenów odpowiadają nazwom semantic text styles:

```css
:root {
  --font-size-h1: clamp(...);
  --font-size-h2: clamp(...);
  --font-size-h3: clamp(...);

  --font-size-body-large: clamp(...);
  --font-size-body-medium: 1.125rem;
  --font-size-body-base: 1rem;
  --font-size-body-small: 0.875rem;
  --font-size-body-tiny: 0.75rem;
}
```

`body-base` jest podstawowym tekstem interfejsu. Nazwa `base` nie koliduje z
rolą font weight `normal`.

## 14.5 Responsywność Font Size

Responsywność jest implementowana bezpośrednio w semantic font-size tokenie.
Nie tworzymy osobnych tokenów desktop i mobile ani osobnej warstwy fluid
typography.

Domyślne zachowanie:

```text
H1–H3           → duży zakres clamp()
H4–H5           → umiarkowany zakres clamp()
H6              → subtelny zakres clamp()
Body large      → różnica maksymalnie 1–2px
Body medium     → fixed lub bardzo subtelny clamp()
Body base       → fixed
Body small      → fixed
Body tiny       → fixed
```

Kierunek kalibracji:

```text
H1          40 → 56
H2          36 → 48
H3          32 → 40
H4          28 → 32
H5          24 → 28
H6          20 → 24

Body large  18 → 20
Body medium 17 → 18
Body base   16
Body small  14
Body tiny   12
```

Przykład:

```css
:root {
  --font-size-h1:
    clamp(3rem, 2.5rem + 2vw, 4rem);

  --font-size-h4:
    clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem);

  --font-size-body-large:
    clamp(1.125rem, 1.08rem + 0.2vw, 1.25rem);

  --font-size-body-base: 1rem;
  --font-size-body-small: 0.875rem;
  --font-size-body-tiny: 0.75rem;
}
```

Media query jest stosowane tylko wtedy, gdy `clamp()` nie zapewnia poprawnego
łamania tekstu lub hierarchii na określonym zakresie szerokości.

Zasady czytelności:

- podstawowy tekst interfejsu ma co najmniej `1rem`,
- tekst `0.875rem` służy treści pomocniczej,
- tekst `0.75rem` służy metadanym i krótkim podpisom,
- istotna treść nie jest skalowana poniżej `0.75rem`,
- inputy zachowują co najmniej `1rem`, aby uniknąć automatycznego zoomu na
  urządzeniach mobilnych.

## 14.6 Line Height

Line-height korzysta z reużywalnych wartości bez jednostki:

```text
line-height/
├── none
├── tight
├── compact
├── normal
└── relaxed
```

```css
:root {
  --line-height-none: 1;
  --line-height-tight: 1.1;
  --line-height-compact: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.6;
}
```

Wartość bez jednostki skaluje się razem z font-size. Finalne wartości są
kalibrowane względem wybranego fonta.

## 14.7 Letter Spacing

```text
letter-spacing/
├── tightest
├── tight
├── subtle
└── default
```

```css
:root {
  --letter-spacing-tightest: -0.03em;
  --letter-spacing-tight: -0.02em;
  --letter-spacing-subtle: -0.01em;
  --letter-spacing-default: 0;
}
```

Letter spacing jest przechowywany w `em`, aby reagował na font-size.

```text
-3% → -0.03em
-2% → -0.02em
-1% → -0.01em
```

Finalne wartości są kalibrowane względem wybranego fonta. Małe teksty mogą
używać `default`, nawet jeśli duże nagłówki korzystają z ujemnego letter
spacingu.

## 14.8 Semantic Text Styles

Semantic text style definiuje pełny kontrakt:

```text
font-family
font-size
font-weight
line-height
letter-spacing
```

Lista podstawowych stylów:

```text
heading-h1
heading-h2
heading-h3
heading-h4
heading-h5
heading-h6
body-large
body-medium
body-base
body-small
body-tiny
label
caption
```

Przykład:

```css
:root {
  --heading-h1-font-family: var(--font-family-heading);
  --heading-h1-font-size: var(--font-size-h1);
  --heading-h1-font-weight: var(--font-weight-emphasis);
  --heading-h1-line-height: var(--line-height-tight);
  --heading-h1-letter-spacing: var(--letter-spacing-tightest);

  --body-base-font-family: var(--font-family-body);
  --body-base-font-size: var(--font-size-body-base);
  --body-base-font-weight: var(--font-weight-normal);
  --body-base-line-height: var(--line-height-normal);
  --body-base-letter-spacing: var(--letter-spacing-subtle);
}
```

Nazwa `heading-h1` opisuje wizualny poziom stylu. Nie wymusza użycia elementu
HTML `<h1>`. Semantyka dokumentu i wizualny styl tekstu są niezależne.

## 14.9 Typografia Komponentów

Komponenty korzystają bezpośrednio z foundations, semantic text styles albo
lokalnych aliasów udostępnionych przez `data-component-size`:

```css
.button {
  font-family: var(--font-family-body);
  font-size: var(--component-font-size);
  font-weight: var(--font-weight-emphasis);
  line-height: var(--component-line-height);
  letter-spacing: var(--letter-spacing-default);
}
```

Nie istnieje osobny plik `typography-components.css`. Button, input, tab,
navigation, badge i pozostałe komponenty nie tworzą niezależnych skal
font-size. Różnica font-weight lub letter-spacing pozostaje decyzją konkretnego
komponentu.

Text decoration, kolor oraz stany linku należą do komponentu link. `Link` nie
jest osobnym semantic text style.

## 14.10 Rich Text

Rich Text mapuje elementy HTML na istniejące semantic text styles:

```text
rich-text h1    → heading-h2
rich-text h2    → heading-h3
rich-text h3    → heading-h5
rich-text p     → body-medium
rich-text small → body-small
```

Rich Text nie posiada osobnej, powielonej skali font-size. Mapowanie może być
dostosowane do kontekstu publikacji bez zmiany globalnej typografii.

## 14.11 Zasady

- system wykorzystuje maksymalnie trzy role font weight,
- konkretne wartości weightów są ustalane po wyborze fonta,
- font nagłówków i font body są oddzielnymi, globalnymi rolami,
- font-size ma własną semantyczną skalę,
- duże nagłówki skalują się mocniej niż małe teksty,
- teksty od `body-base` w dół pozostają fixed,
- `clamp()` jest częścią semantic font-size tokena,
- line-height jest przechowywany bez jednostki,
- letter-spacing jest przechowywany w `em`,
- semantic text style zawiera pełny kontrakt właściwości,
- style powstają tylko wtedy, gdy mają rzeczywiste zastosowanie,
- komponenty aliasują istniejące tokeny zamiast tworzyć równoległe skale,
- semantyka HTML jest niezależna od wizualnego poziomu nagłówka.

## 14.12 Struktura W Kodzie

```text
src/styles/tokens/
  typography-foundations.css
  typography-semantic.css
```

`typography-foundations.css` zawiera font families, weight roles, font sizes,
line heights i letter spacing. `typography-semantic.css` składa foundations w
pełne text styles. Komponenty konsumują te tokeny bez dodatkowej, powielonej
warstwy typograficznej.

---

# 15. Architektura Layoutu I Site Settings

## 15.1 Model Warstw

```text
Layout foundations
        ↓
Global layout semantics
        ↓
Layout patterns i component layout tokens
        ↓
CSS layout
```

Layout foundations przechowują parametry systemu. Global layout semantics
opisują kontenery, padding strony i grid. Layout patterns wykorzystują te
same tokeny do budowania kompozycji, list oraz komponentów.

## 15.2 Layout Foundations

```text
layout/
├── fluid-viewport-min
├── fluid-viewport-max
├── container-main-max
├── container-small-max
├── site-padding-inline-min
├── site-padding-inline-max
└── breakpoints/
    ├── medium
    └── small
```

Przykładowa konfiguracja:

```css
:root {
  --fluid-viewport-min: 20rem;
  --fluid-viewport-max: 90rem;

  --site-padding-inline-min: var(--size-16);
  --site-padding-inline-max: var(--size-40);

  --breakpoint-medium: 64rem;
  --breakpoint-small: 48rem;
}
```

Zasady:

- `fluid-viewport-min` i `fluid-viewport-max` definiują zakres kalibracji
  wartości płynnych,
- maksymalna szerokość kontenera jest niezależna od breakpointu,
- breakpoint opisuje moment zmiany zachowania, a nie szerokość projektu,
- wartości foundations nie są używane bezpośrednio przez komponenty,
- finalne wartości są kalibrowane podczas implementacji layoutu.

## 15.3 Site Padding

`site-padding-inline` definiuje minimalną odległość treści od krawędzi
viewportu:

```css
:root {
  --site-padding-inline:
    clamp(
      var(--site-padding-inline-min),
      0.5rem + 2vw,
      var(--site-padding-inline-max)
    );
}
```

Nazwa `site-padding-inline` zastępuje niejednoznaczne określenia `margin` oraz
`layout-padding-main`. Jest używana przez wszystkie podstawowe kontenery
strony.

## 15.4 Containers

Podstawowe role kontenerów:

```text
container/
├── main
├── small
└── full
```

Maksymalna szerokość głównego kontenera może być wartością obliczaną:

```css
:root {
  --container-main-max:
    calc(
      var(--fluid-viewport-max) -
      2 * var(--site-padding-inline-max)
    );

  --container-small-max: 50rem;
  --container-full-max: 100%;
}
```

Implementacja:

```css
.container {
  width:
    min(
      calc(100% - 2 * var(--site-padding-inline)),
      var(--container-main-max)
    );
  margin-inline: auto;
}

.container--small {
  max-width: var(--container-small-max);
}

.container--full {
  width: 100%;
  max-width: var(--container-full-max);
}
```

Kontener nie przechowuje ręcznie wpisanej szerokości dla każdego breakpointu.
Jego szerokość wynika z viewportu, site paddingu i maksymalnej szerokości.

## 15.5 Main Composition Grid

Globalny grid kompozycyjny przechowuje:

```text
grid/
├── column-count
└── column-gap
```

```css
:root {
  --site-grid-columns: 12;
  --site-grid-column-gap:
    clamp(var(--size-16), 0.8rem + 0.5vw, var(--size-20));
}

.site-grid {
  display: grid;
  grid-template-columns:
    repeat(var(--site-grid-columns), minmax(0, 1fr));
  column-gap: var(--site-grid-column-gap);
}
```

Rekomendowana liczba kolumn:

```text
desktop → 12
tablet  → 8
mobile  → 4
```

```css
@media (width < 64rem) {
  :root {
    --site-grid-columns: 8;
  }
}

@media (width < 48rem) {
  :root {
    --site-grid-columns: 4;
  }
}
```

Grid jest punktem odniesienia dla:

- `grid-column`,
- `grid-column-start`,
- `grid-column-end`,
- spanów,
- wyrównywania elementów pomiędzy sekcjami,
- budowania kompozycji z pustymi kolumnami.

`row-gap` nie jest stałym ustawieniem głównego grida. Konkretna sekcja lub
komponent aliasuje właściwy globalny token `gap`.

## 15.6 Auto-fit I Auto-fill

Grid kompozycyjny i grid kolekcji rozwiązują różne problemy.

Main composition grid:

```css
.site-grid {
  grid-template-columns:
    repeat(var(--site-grid-columns), minmax(0, 1fr));
}
```

Grid kolekcji:

```css
.l-grid[data-grid="auto-fit"] {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, var(--grid-auto-min-width)), 1fr));
  gap: var(--gap-medium);
}

.l-grid[data-min-width="small"] {
  --grid-auto-min-width: var(--grid-auto-min-width-small);
}
```

Globalne warianty `small`, `card`, `panel` i `wide` opisują minimalną
szerokość elementu przed zawinięciem siatki. `card` jest wartością domyślną.

Zasady:

- main composition grid służy świadomemu rozmieszczaniu elementów na
  kolumnach,
- `auto-fit` służy responsywnym listom kart i elementów o minimalnej
  szerokości,
- `auto-fill` jest używany, gdy puste tory grida powinny pozostać zachowane,
- grid kolekcji nie korzysta z globalnej liczby kolumn,
- minimalna szerokość elementu kolekcji może być component tokenem.

## 15.7 Lokalne Decyzje Layoutu Komponentów

Komponent może definiować własne role layoutowe lokalnie w swoim pliku CSS:

```text
card-grid/min-item-width
modal/max-width
sidebar/width
navigation/height
hero/content-column-start
hero/content-column-span
```

Lokalny token może aliasować global layout semantic albo przechowywać wartość
właściwą dla komponentu. Nie istnieje centralny `layout-components.css`,
ponieważ wartości hero, modala czy sidebara nie są globalnymi foundations.

Przykład:

```css
:root {
  --card-grid-min-item-width: 18rem;
  --modal-max-width: var(--container-small-max);
  --hero-content-column-start: 3;
  --hero-content-column-span: 6;
}
```

Wartości strukturalne, takie jak column start i span, są zmieniane przez media
lub container queries, gdy kompozycja wymaga innego układu.

## 15.8 Grid Visualizer

Grid Visualizer jest narzędziem developerskim korzystającym z tych samych
tokenów co rzeczywisty layout:

```text
GridGuide
├── site-padding-inline
├── container-main-max
├── site-grid-columns
└── site-grid-column-gap
```

W Astro komponent jest renderowany wyłącznie w środowisku development:

```astro
{import.meta.env.DEV && <GridGuide />}
```

Przykładowa struktura:

```astro
---
const columns = Array.from(
  { length: 12 },
  (_, index) => index + 1
);
---

<div class="grid-guide" data-debug-grid>
  {columns.map((column) => (
    <div class="grid-guide__column">{column}</div>
  ))}
</div>
```

```css
.grid-guide {
  display: grid;
  grid-template-columns:
    repeat(var(--site-grid-columns), minmax(0, 1fr));
  column-gap: var(--site-grid-column-gap);
  width:
    min(
      calc(100% - 2 * var(--site-padding-inline)),
      var(--container-main-max)
    );
  pointer-events: none;
  position: fixed;
  inset-block: 0;
  inset-inline: 50% auto;
  transform: translateX(-50%);
  z-index: 9999;
}
```

Liczba renderowanych elementów Visualizera powinna odpowiadać aktywnej liczbie
kolumn. Implementacja może generować osobne zestawy dla `12`, `8` i `4` albo
sterować ich widocznością poprzez CSS.

Visualizer:

- nie jest częścią produkcyjnego interfejsu,
- nie wpływa na layout dokumentu,
- nie przyjmuje zdarzeń wskaźnika,
- odzwierciedla aktualny container, padding i gap,
- może być włączany dodatkowym przełącznikiem developerskim.

## 15.9 Integracja Z Responsywnym Sizingiem

Layout foundations definiują:

- zakres viewportu używany przez `clamp()`,
- breakpointy globalnych responsive overrides,
- maksymalne szerokości kontenerów.

Sizing semantics definiują:

- minimalne i maksymalne paddingi,
- gapy,
- spacing sekcji,
- wymiary komponentów.

Przykład zależności:

```css
:root {
  --fluid-viewport-min: 20rem;
  --fluid-viewport-max: 90rem;

  --site-padding-inline-min: var(--size-16);
  --site-padding-inline-max: var(--size-40);

  --site-padding-inline:
    clamp(
      var(--site-padding-inline-min),
      0.5rem + 2vw,
      var(--site-padding-inline-max)
    );
}
```

Layout nie tworzy równoległej skali spacingu. Aliasuje size primitives i size
semantics.

## 15.10 Struktura W Kodzie

```text
src/styles/tokens/
  layout-foundations.css
  layout-semantic.css
  layout-styles.css

src/components/dev/
  GridGuide.astro
```

`layout-foundations.css` zawiera zakres viewportu, breakpointy i maksymalne
szerokości. `layout-semantic.css` zawiera site padding, kontenery oraz główny
grid. `layout-styles.css` wystawia publiczne layout objects oraz utrzymuje
techniczne obliczenia, takie jak breakout tracks, jako prywatne szczegóły
implementacji. Decyzje layoutowe konkretnych komponentów pozostają przy ich
implementacji i są promowane do globalnego systemu dopiero po potwierdzeniu
powtarzalnej roli.

## 15.11 Zasady

- kontener jest obliczany dynamicznie,
- site padding skaluje się przez `clamp()`,
- maksymalna szerokość kontenera nie jest breakpointem,
- główny grid korzysta z `12/8/4` kolumn,
- column gap jest globalnym semantic tokenem,
- row gap korzysta z globalnej skali `gap`,
- szerokość kolumn wynika natywnie z CSS Grid i jednostek `fr`,
- `auto-fit` i `auto-fill` są niezależnymi wzorcami gridów kolekcji,
- komponent może definiować własne span, start i minimalne szerokości,
- Grid Visualizer korzysta z rzeczywistych tokenów layoutu,
- Grid Visualizer jest dostępny wyłącznie w środowisku developerskim,
- layout aliasuje istniejące size primitives i semantics.

---

# 16. Otwarte Decyzje

## 16.1 Wartości Palet Kolorów

Konkretna rampa `OKLCH`, wartości chromy i finalne kolory zostaną ustalone
podczas implementacji i eksploracji wizualnej, a następnie sprawdzone pod
kątem kontrastu.

## 16.2 Finalna Skala Size Primitives

Architektura skali jest zatwierdzona. Dokładny zestaw wartości zostanie
skalibrowany podczas implementacji tokenów.

## 16.3 Font Family I Font Weights

Inter jest aktualnym fontem bazowym startera dla nagłówków i body. Alternatywne
fonty oraz finalne wartości trzech ról `normal`, `emphasis` i `strong` zostaną
sprawdzone podczas eksploracji wizualnych na osobnych branchach.

---

# 17. Następny Krok

System zmiennych jest podłączony do prototypu Astro. Kolejne zmiany wizualne
powinny powstawać przez aktualizację primitives, semantics, text styles oraz
shared component size profiles, zamiast ponownego wprowadzania surowych
wartości do komponentów.

Produktowe decyzje strukturalne, takie jak szerokość sidebara, drawera,
timeline'u lub konkretnego panelu, pozostają lokalnymi tokenami implementacji.
Do globalnej architektury awansują dopiero po potwierdzeniu, że reprezentują
powtarzalną rolę w wielu komponentach lub produktach.

Następnym etapem są eksploracje wizualne na osobnych branchach wychodzących z
zatwierdzonego `clean starting point`.
