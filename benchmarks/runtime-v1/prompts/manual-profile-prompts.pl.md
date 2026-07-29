# Runtime V1.0 — manual profile prompts

Polskojęzyczny katalog promptów do ręcznego testowania profili:
`exact-edit`, `reuse`, `compose`, `repair`, `extend` i `create`.

Każdy scenariusz należy uruchamiać w osobnej sesji i na tym samym snapshotcie
repozytorium. `compose` tworzy nową kompozycję strony lub sekcji bez dodawania
publicznego komponentu. `reuse` korzysta z rzeczywistych nazw z registry.
`extend` dodaje brakującą funkcję do istniejącego komponentu. `create` wskazuje
komponent, którego nie ma w aktualnym registry, ale nadal wymaga przejścia
creation gate.

# exact-edit

## S — `--color-background-canvas`

```text
W ciemnym motywie tło całej strony jest trochę za ciężkie. Zmień wyłącznie wartość `--color-background-canvas` z `var(--color-neutral-950)` na `var(--color-neutral-900)`.

Nie zmieniaj jasnego motywu, pozostałych color variables ani komponentów. Uruchom tylko walidację foundations potrzebną dla tej zmiany.
```

Setup: gpt-5.6-luna + low + Fast

Why: To pojedyncza, dokładnie nazwana zmiana o oczywistej metodzie i taniej walidacji.

Use instead if: Wybierz Luna + low + Standard, jeśli ważniejsze jest niższe zużycie kredytów.

## M — body-small variables

```text
Mały tekst body powinien być trochę bardziej kompaktowy. Ustaw `--font-size-body-small-min` i `--font-size-body-small-max` na `0.8125rem`.

Nie zmieniaj pozostałych typography variables ani semantic aliases. Sprawdź wyłącznie foundations typography.
```

Setup: gpt-5.6-luna + medium + Fast

Why: Zmiana jest mała, ale wymaga sprawdzenia dwóch powiązanych variables i ich semantic alias.

Use instead if: Wybierz Luna + medium + Standard, jeśli wykonujesz tylko jeden taki test.

## L — canvas i input aliases

```text
Ujednolić tła strony i pól formularzy w obu motywach.

`--color-background-canvas` ma pozostać źródłem tła strony, a `--input-background-default` i `--input-background-focus` powinny nadal wskazywać na canvas zamiast wprowadzać własne wartości kolorów.

Sprawdź oba motywy, ale nie zmieniaj komponentów, registry, Brand Contract ani reguł Figmy.
```

Setup: gpt-5.6-terra + medium + Standard

Why: Nadal jest to ograniczona zmiana tokenów, ale obejmuje kilka aliasów i dwa motywy.

Use instead if: Przejdź na Terra + high + Standard, jeśli audit ujawni więcej zależnych tokenów.

# reuse

## S — Button.Primary

W istniejącej sekcji kontaktowej dodaj główne CTA „Umów konsultację”, prowadzące do `/contact`.

Użyj istniejącego `Button.Primary` w rozmiarze medium. Nie twórz nowego przycisku, wariantu ani własnych stylów.

Setup: gpt-5.6-luna + low + Fast

Why: To jednoznaczne użycie pojedynczego istniejącego komponentu.

Use instead if: Wybierz Luna + low + Standard, jeśli nie wykonujesz serii krótkich testów.

## M — ArticleCard.Compact

W istniejącej sekcji aktualności dodaj kartę najnowszego artykułu.

Użyj `ArticleCard` w wariancie `compact` z tytułem „Projektowanie z AI”, kategorią „Design”, datą 29 lipca 2026, czasem czytania „6 min” i linkiem `/blog/projektowanie-z-ai`.

Karta nie powinna zawierać zdjęcia ani excerptu. Nie twórz nowego komponentu karty.

Setup: gpt-5.6-terra + medium + Standard

Why: Trzeba poprawnie wykorzystać istniejący wariant i jego publiczny kontrakt.

Use instead if: Wybierz Luna + medium + Standard, jeśli miejsce wstawienia jest już otwarte w edytorze.

## L — Carousel.MultiItem

```text
W istniejącej sekcji realizacji dodaj carousel z sześcioma projektami.

Użyj istniejącego `Carousel` w wariancie `multi-item`. Każdy element powinien mieć tytuł, krótki opis, zatwierdzony obraz i prawdziwy link do projektu.

Zachowaj obecne responsywne zachowanie komponentu: trzy elementy na desktopie, dwa na tablecie i jeden na mobile. Nie twórz nowego carousela i nie instaluj zewnętrznej biblioteki.
```

Setup: gpt-5.6-terra + medium + Standard

Why: Komponent istnieje, lecz jego konfiguracja obejmuje dane, obrazy, linki i zachowanie responsywne.

Use instead if: Przejdź na Sol + high + Standard, jeśli wymagania wykraczają poza obecny wariant `multi-item`.

# compose

## S — blok kontaktowy

```text
Na stronie oferty skomponuj nowy blok zachęcający do kontaktu.

Użyj `SectionHeader` z eyebrow „Kontakt” i nagłówkiem „Porozmawiajmy o Twoim projekcie”. W actions slot umieść `Button.Primary` „Umów konsultację”.

Zbuduj blok z istniejących layout primitives i spacing variables. To ma być kompozycja na stronie, a nie nowy publiczny komponent design systemu.
```

Setup: gpt-5.6-terra + low + Standard

Why: To niewielka kompozycja dwóch istniejących komponentów bez zmiany API.

Use instead if: Wybierz Terra + medium + Standard, jeśli trzeba dopasować blok do złożonego istniejącego layoutu.

## M — sekcja editorial

```text
Na stronie bloga skomponuj nową sekcję „Najnowsze artykuły”.

Na początku użyj `SectionHeader` z eyebrow „Blog”, nagłówkiem „Najnowsze artykuły” i `Button.Link` „Zobacz wszystkie”.

Poniżej pokaż sześć `ArticleCard` w wariancie `standard`. Układ powinien mieć trzy kolumny na desktopie, dwie na tablecie i jedną na mobile. Użyj istniejących `l-section`, `l-container`, `l-grid` oraz `--gap-large`.

Nie twórz `BlogSection`, `BlogCard` ani żadnego innego publicznego komponentu. To ma pozostać kompozycją istniejących elementów na tej stronie.
```

Setup: gpt-5.6-terra + medium + Standard

Why: To regularna, responsywna kompozycja wielu istniejących komponentów.

Use instead if: Przejdź na Sol + high + Standard, jeśli istniejące layout primitives nie pozwalają spełnić wymagań.

## L — strona produktowa

```text
Skomponuj nową stronę produktową dla platformy AI.

Użyj wyłącznie istniejących komponentów design systemu:

- `HeroSection` w wariancie `split`;
- `FeatureSection` w wariancie `grid`;
- `StatsSection` w wariancie `metric-cards`;
- `TestimonialSection` w wariancie `carousel`;
- `CtaSection` w wariancie `full-bleed`.

Zadbaj o jedną logiczną hierarchię nagłówków, prawdziwe linki, spójny rytm sekcji i istniejące layout oraz spacing variables.

Nie twórz nowych publicznych komponentów, wariantów ani tokenów. Jeśli brakuje zatwierdzonego Brand Contract lub treści, zwróć blocked zamiast wymyślać markę.
```

Setup: gpt-5.6-sol + high + Standard

Why: Pełna strona łączy wiele publicznych kontraktów, layout, semantykę i reguły marki.

Use instead if: Wybierz Sol + medium + Standard, jeśli treść i układ zostały już dokładnie zatwierdzone.

# repair

Scenariusze `repair` wymagają przygotowanej regresji. Bez niej poprawnym
rezultatem może być stwierdzenie, że aktualny kontrakt jest już prawidłowy.

## S — Button.Primary focus

```text
W `Button.Primary` przestał być widoczny focus state podczas nawigacji klawiaturą, chociaż hover nadal działa.

Napraw istniejący komponent bez zmiany jego publicznego API. Focus powinien korzystać z `--component-focus-ring`, `--border-width-strong` i właściwego outline offsetu opartego na `--size-2`.

Sprawdź focus-visible dla wszystkich wariantów `Button`.
```

Setup: gpt-5.6-terra + medium + Standard

Why: To ograniczony bug istniejącego komponentu z jasnym symptomem i prostą walidacją accessibility.

Use instead if: Przejdź na Sol + high + Standard, jeśli problem pochodzi ze współdzielonych state tokens.

## M — ArticleCard.Compact contract

```text
`ArticleCard` w wariancie `compact` zaczął przyjmować excerpt i media, przez co wygląda jak zwykła karta.

Przywróć kontrakt `ArticleCard.Compact`: karta nie może przyjmować excerptu ani media slotu, ale nadal powinna obsługiwać category, publishedDate i opcjonalny readingTime.

Nie dodawaj nowych propsów i nie zmieniaj zachowania wariantów `featured` oraz `standard`.
```

Setup: gpt-5.6-terra + high + Standard

Why: Naprawa dotyczy publicznego kontraktu wariantu i wymaga ochrony pozostałych zachowań komponentu.

Use instead if: Przejdź na Sol + high + Standard, jeśli regresja obejmuje również registry lub Guides.

## L — SwiperStarter accessibility

```text
`SwiperStarter` niepoprawnie wystawia nieaktywne slajdy czytnikom ekranu i pozwala przejść fokusem do ich zawartości.

Napraw carousel tak, aby tylko aktywny slajd miał `aria-current`, a pozostałe były odpowiednio `aria-hidden` i `inert`. Przyciski Previous i Next muszą poprawnie reagować na pierwszy i ostatni slajd, a live region ma ogłaszać aktualną pozycję.

Nie zmieniaj publicznego API komponentu i nie dodawaj zewnętrznej biblioteki.
```

Setup: gpt-5.6-sol + high + Standard

Why: To consequential accessibility repair obejmujący DOM state, fokus, sterowanie i komunikaty live.

Use instead if: Użyj Terra + high + Standard, jeśli regresja została już dokładnie zlokalizowana w jednej funkcji.

# extend

## S — SectionHeader.description

```text
Rozszerz istniejący `SectionHeader` o opcjonalny prop `description`.

Opis powinien pojawiać się pod nagłówkiem i korzystać z istniejących body typography oraz `--color-text-secondary`. Jeżeli description nie zostanie przekazane, obecny markup i wygląd komponentu nie mogą się zmienić.

Nie twórz nowego komponentu. Zaktualizuj publiczne API, registry i Guides.
```

Setup: gpt-5.6-terra + medium + Standard

Why: To ograniczone, kompatybilne rozszerzenie jednego istniejącego komponentu.

Use instead if: Przejdź na Sol + high + Standard, jeśli opis wpływa na kilka wariantów lub istniejące section patterns.

## M — ArticleCard author

```text
Rozszerz istniejący `ArticleCard` o opcjonalne informacje o autorze.

Dodaj props `authorName` oraz opcjonalny `authorRole`. Autor powinien pojawiać się w metadanych karty obok daty i readingTime. Puste wartości mają być odrzucane.

Obecne użycia bez autora nie mogą zmienić markup ani wyglądu. Sprawdź warianty `featured`, `standard` i `compact`, a następnie zsynchronizuj registry oraz Guides.

Nie twórz `AuthorCard` ani nowego wariantu ArticleCard.
```

Setup: gpt-5.6-sol + medium + Standard

Why: Rozszerzenie publicznego API wpływa na walidację danych, trzy warianty i dokumentację.

Use instead if: Wybierz Terra + medium + Standard, jeśli autor ma być obsługiwany tylko w jednym lokalnym użyciu.

## L — Carousel items-per-view

```text
Rozszerz istniejący `Carousel` o opcjonalną konfigurację liczby widocznych elementów dla desktopu, tabletu i mobile.

Potrzebuję móc ustawić dwie karty na desktopie oraz jedną na tablecie i mobile. Domyślne zachowanie wariantu `multi-item` — trzy, dwa i jeden — musi pozostać bez zmian dla obecnych użyć.

Oprzyj implementację na `--carousel-items-per-view` i istniejących gap variables. Zaktualizuj props, typy, registry i Guides. Sprawdź scroll snap, ResizeObserver, sterowanie klawiaturą, Previous/Next i reduced motion.

Nie twórz nowego carousel component.
```

Setup: gpt-5.6-sol + high + Standard

Why: To cross-cutting zmiana publicznego API, responsywnego CSS, runtime i accessibility.

Use instead if: Wybierz Sol + medium + Standard, jeśli wymaganie można spełnić bez zmiany publicznego API.

# create

Nazwy `Keycap`, `AuthorByline` i `ArticleCardCarouselSection` nie występują
w aktualnym registry. Brak nazwy nie jest jednak wystarczającym dowodem luki:
każdy scenariusz nadal musi przejść creation gate.

## S — Keycap

```text
Stwórz nowy publiczny komponent design-system `Keycap` do prezentowania pojedynczego klawisza, na przykład Esc, Enter albo ⌘.

Komponent ma używać semantycznego elementu `kbd`, przyjmować wymagany `label` i opcjonalny dostępny `ariaLabel`. Wygląd oprzyj wyłącznie na istniejących typography, border, radius, surface i spacing variables.

Najpierw potwierdź, że registry nie zawiera równoważnego komponentu. Dodaj implementację, registry, Guides i minimalną walidację.
```

Setup: gpt-5.6-sol + medium + Standard

Why: To mały, ale publiczny komponent wymagający gap check i synchronizacji źródeł prawdy.

Use instead if: Wybierz Terra + medium + Standard, jeśli zadanie zostanie ograniczone do lokalnego elementu bez publicznego API.

## M — AuthorByline

```text
Stwórz nowy publiczny komponent design-system `AuthorByline` do prezentowania autora artykułu.

Komponent powinien korzystać z istniejącego `Avatar` i przyjmować: `name`, opcjonalne `role`, opcjonalne `href` oraz opcjonalny tekst daty publikacji. Imię jest wymagane, puste wartości powinny być odrzucane, a link musi być bezpieczny.

Użyj istniejących typography, color i spacing variables. Potwierdź lukę w registry, a następnie dodaj source, publiczne API, registry, Guides i walidację.
```

Setup: gpt-5.6-sol + medium + Standard

Why: Nowa molekuła ma zależność, publiczne API, walidację danych i dokumentację.

Use instead if: Przejdź na Sol + high + Standard, jeśli komponent ma zostać od razu zintegrowany z kilkoma istniejącymi rodzinami.

## L — ArticleCardCarouselSection

```text
Stwórz nowy publiczny komponent design-system `ArticleCardCarouselSection`.

Ma prezentować `SectionHeader` oraz kolekcję istniejących `ArticleCard`. W actions slot nagłówka powinien móc znaleźć się istniejący `Button.Link`.

Sekcja ma pokazywać dwie karty na desktopie oraz jedną na tablecie i mobile. Sterowanie musi być ręczne i dostępne: Previous/Next, obsługa klawiatury, scroll snap, live region, first/middle/last state oraz reduced motion.

Nie duplikuj logiki `Carousel`. Najpierw sprawdź, czy wymaganie można spełnić przez jego bezpieczne rozszerzenie lub kompozycję. Jeśli tak, zwróć blocked dla creation i zaproponuj właściwy workflow. Twórz `ArticleCardCarouselSection` tylko po potwierdzeniu rzeczywistej, powtarzalnej luki.

Jeżeli creation gate zostanie spełniony, dodaj pełne API, registry, Guides, family rules i wymagane walidatory.
```

Setup: gpt-5.6-sol + high + Standard

Why: To złożony publiczny komponent obejmujący kilka rodzin, interakcję, accessibility i creation gate.

Use instead if: Użyj Sol + medium + Standard, jeśli wcześniej zatwierdzono API i sposób współdzielenia runtime z `Carousel`.

# Profile boundary examples

```text
SectionHeader + ArticleCard w zwykłym gridzie
```

To profil `compose`.

```text
Carousel ma dostać nowe responsive items-per-view
```

To profil `extend`.

```text
Potrzebuję nowego, powtarzalnego ArticleCardCarouselSection
```

To profil `create`, ale dopiero po wykazaniu, że kompozycja lub rozszerzenie
`Carousel` nie wystarczą.

