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

## M — Accordion

W istniejącej sekcji pomocy dodaj FAQ z dwoma pytaniami.

Użyj istniejącego `Accordion` z id `runtime-faq`. Pierwszy element „Jak zacząć?” powinien być początkowo otwarty, a drugi „Jak walidować?” zamknięty.

Nie twórz nowego komponentu ani lokalnego zachowania akordeonu.

Setup: gpt-5.6-terra + medium + Standard

Why: Trzeba poprawnie wykorzystać istniejący kontrakt danych i stanu początkowego.

Use instead if: Wybierz Luna + medium + Standard, jeśli miejsce wstawienia jest już otwarte w edytorze.

## L — MediaRatio

W istniejącej sekcji projektu dodaj MediaRatio dla obrazu z danych projektu.

Użyj proporcji `21:9`, zachowaj alternatywny opis obrazu i nie twórz
lokalnego wrappera proporcji.

Setup: gpt-5.6-terra + medium + Standard

Why: Konfiguracja wykorzystuje publiczny kontrakt proporcji i slota treści.

Use instead if: Przejdź na Sol + high + Standard, jeśli wymaganie zmienia publiczne proporcje lub semantykę mediów.

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

## M — sekcja pomocy

```text
Na stronie pomocy skomponuj nową sekcję „Najczęstsze pytania”.

Na początku użyj `SectionHeader` z eyebrow „Pomoc”, nagłówkiem „Najczęstsze pytania” i `Button.Link` „Zobacz dokumentację”.

Poniżej użyj istniejącego `Accordion` do grupowania pytań i odpowiedzi. Oprzyj kompozycję na `l-section`, `l-container` i `l-stack`.

Nie twórz `HelpSection` ani żadnego innego publicznego komponentu. To ma pozostać kompozycją istniejących elementów na tej stronie.
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

Napraw istniejący komponent bez zmiany jego publicznego API. Focus powinien korzystać z `--color-state-focus-ring`, `--border-width-strong` i właściwego outline offsetu opartego na `--size-2`.

Sprawdź focus-visible dla wszystkich wariantów `Button`.
```

Setup: gpt-5.6-terra + medium + Standard

Why: To ograniczony bug istniejącego komponentu z jasnym symptomem i prostą walidacją accessibility.

Use instead if: Przejdź na Sol + high + Standard, jeśli problem pochodzi ze współdzielonych state tokens.

## M — Accordion contract

```text
`Accordion` przestał odrzucać dwa elementy z tym samym identyfikatorem.

Przywróć walidację zduplikowanych `item.id`, zachowując generowanie stabilnych identyfikatorów dla elementów bez jawnego id.

Nie dodawaj nowych propsów i nie zmieniaj zachowania `closeSiblings`, stanów disabled ani początkowo otwartego elementu.
```

Setup: gpt-5.6-terra + high + Standard

Why: Naprawa dotyczy walidacji publicznego kontraktu danych i wymaga ochrony pozostałych zachowań komponentu.

Use instead if: Przejdź na Sol + high + Standard, jeśli regresja obejmuje również registry lub Guides.

## L — Rating accessibility

Rating nie przekazuje czytnikowi ekranu dokładnej wartości i tekstu wspierającego.

Przywróć jedną skonsolidowaną etykietę dostępną. Nie zmieniaj publicznego API.

Setup: gpt-5.6-sol + high + Standard

Why: To istotna naprawa dostępności obejmująca wizualizację oraz dokładny tekst.

Use instead if: Użyj Terra + high + Standard, jeśli regresja została już dokładnie zlokalizowana.

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

## M — Accordion heading level

```text
Rozszerz istniejący `Accordion`, przywracając udokumentowany prop `headingLevel`.

Prop powinien obsługiwać zatwierdzone poziomy od `h2` do `h6` i sterować semantycznym elementem nagłówka każdego elementu.

Obecne użycia bez jawnej wartości muszą zachować domyślne `h3`. Zsynchronizuj source, registry oraz Guides.

Nie twórz nowego komponentu ani wariantu Accordion.
```

Setup: gpt-5.6-sol + medium + Standard

Why: Rozszerzenie publicznego API wpływa na semantykę nagłówków, registry i dokumentację.

Use instead if: Wybierz Terra + medium + Standard, jeśli autor ma być obsługiwany tylko w jednym lokalnym użyciu.

## L — Rating supporting-text contract

Przywróć w Rating uzgodniony prop `supportingText`.

Zaktualizuj source, registry, Guides, family rules, adapter Figma i walidację. Nie twórz nowego komponentu ani lokalnego wariantu.

Setup: gpt-5.6-sol + high + Standard

Why: Zmiana publicznego API wpływa na kod, dokumentację, Figma i dostępność.

# create

Nazwy `Keycap`, `DisclosureSummary` i `DisclosurePanelGroup` nie występują
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

## M — DisclosureSummary

```text
Stwórz nowy publiczny komponent design-system `DisclosureSummary` dla potwierdzonej, powtarzalnej potrzeby krótkiego podsumowania sterującego ujawnianiem szczegółów.

Komponent powinien reużywać istniejące kontrakty `Tab` i `Button`, przyjmować wymagany tytuł oraz opcjonalny opis i akcję. Puste wartości powinny być odrzucane.

Użyj istniejących typography, color i spacing variables. Potwierdź lukę w registry, a następnie dodaj source, publiczne API, registry, Guides i walidację rodziny disclosure.
```

Setup: gpt-5.6-sol + medium + Standard

Why: Nowa molekuła ma zależność, publiczne API, walidację danych i dokumentację.

Use instead if: Przejdź na Sol + high + Standard, jeśli komponent ma zostać od razu zintegrowany z kilkoma istniejącymi rodzinami.

## L — DisclosurePanelGroup

```text
Stwórz nowy publiczny komponent design-system `DisclosurePanelGroup`.

Ma komponować istniejące `Accordion` oraz `Tab` dla potwierdzonego, powtarzalnego wzorca wielu kategorii paneli.

Sterowanie musi zachować istniejące role tablist/tabpanel, obsługę klawiatury, roving tabindex, stabilne identyfikatory i semantyczne nagłówki akordeonu.

Nie duplikuj logiki `Accordion` ani `Tab`. Najpierw sprawdź, czy wymaganie można spełnić przez kompozycję. Jeśli tak, zwróć blocked dla creation i zaproponuj właściwy workflow. Twórz `DisclosurePanelGroup` tylko po potwierdzeniu rzeczywistej, powtarzalnej luki.

Jeżeli creation gate zostanie spełniony, dodaj pełne API, registry, Guides, family rules i wymagane walidatory.
```

Setup: gpt-5.6-sol + high + Standard

Why: To złożony publiczny komponent obejmujący kilka rodzin, interakcję, accessibility i creation gate.

Use instead if: Użyj Sol + medium + Standard, jeśli wcześniej zatwierdzono API i kontrakt tekstu wspierającego Rating.

# Profile boundary examples

```text
SectionHeader + Accordion + TrustBadge w zwykłej kompozycji
```

To profil `compose`.

```text
Rating ma odzyskać publiczny supportingText
```

To profil `extend`.

```text
Potrzebuję nowego, powtarzalnego DisclosurePanelGroup
```

To profil `create`, ale dopiero po wykazaniu, że kompozycja lub rozszerzenie
`Accordion` i `Tab` nie wystarczą.
