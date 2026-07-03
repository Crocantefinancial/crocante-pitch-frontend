# Plan de componetización — Dashboard Crocante v3

> **Objetivo:** reconstruir las pantallas de los prototipos HTML de `Crocantefinancial/Dashboard-Test` (flujo ≈ `crocante-hifi`) como front componetizado dentro de **este repo** (`crocante-pitch-frontend`), siguiendo exactamente su arquitectura, convenciones y sistema de estilos.
>
> **Ejecutor previsto:** agente (Opus 4.8) trabajando fase por fase. Cada fase tiene entregables y criterios de aceptación. **No avanzar de fase sin que `yarn build` pase.**
>
> **Repos fuente (solo lectura, clonarlos si no están):**
> - `Crocantefinancial/Dashboard-Test` → prototipos HTML standalone (fuente de verdad visual y de flujo)
> - `Crocantefinancial/crocante-website/crocante-hifi` → prototipo hi-fi previo (referencia de flujo general, NO de pixel)

---

## 1. Contexto — Mapa unificado del flujo

### 1.1 Flujo maestro (unión de crocante-hifi + Dashboard-Test)

```
Landing / Ingreso (invite code)                    [hifi: index.html, ingreso/]
        │
        ▼
Auth: email → verify → OTP                         [Crocante Prototype: pantallas 01-06]
        │
        ▼
Workspace name → "Verify your entity"              [Crocante Prototype: 07-08]
        │
        ▼
KYB wizard (3 pasos, gate del dashboard)           [kyc-flow.mermaid + kyc-flow.html]
  Paso 1: Datos empresa (2 sub-tabs)
  Paso 2: Documentación (2 sub-tabs, validaciones)
  Paso 3: Confirmación → En proceso → Aprobado / Info adicional / Rechazado
        │
        ▼
Dashboard shell (sidebar + env switcher + tour)    [Crocante Portfolio (offline).html]
        │
        ├── Portfolio (pantalla default)           hero + chart + actions + holdings
        │     └── Sub-account detail               + accounts + activity feed + checklist
        ├── Activity                               tabla + drawer detalle + approvals multi-firma
        ├── Invest / Colocaciones                  vault picker → fund detail → wizard 4 pasos
        ├── Cross-border                           recipients (empty→list→add wizard)
        │                                          + transfer wizard 4 pasos
        ├── Team & Roles                           tabla miembros + roles + invite wizard
        └── Stubs: Payroll · Cards · Taxes · Custody · Staking · Credit
```

- **Environment switcher** transversal: pills `All / Spend (sp) / Save-Treasury (sv)` con atajos ⌘⇧A/O/T. Tiñe métricas y filtra contenido por entorno.
- **Onboarding checklist** en Portfolio: 4 pasos (`create`, `kyb`, `invite`, `fund`), independientes.
- **Gate KYB:** el dashboard se bloquea con overlay hasta completar el KYB (patrón de crocante-hifi `app/dashboard/index.html`).

### 1.2 Fuente de verdad por módulo

Regla general: los archivos `*Prototype*` / nombre simple son los **interactivos** (implementar desde ahí); los `*Flow* / *User Flow* / Flujo*` son **diagramas de flujo** de las mismas pantallas (consultarlos solo para transiciones/ramas).

| Módulo | Implementar desde (en `Dashboard-Test/`) | Flujo/ramas |
|---|---|---|
| Design tokens | `Crocante DS v2.3.html` | — |
| Onboarding + auth | `Crocante Prototype (standalone).html` | `Crocante User Flow (standalone).html` |
| KYB | `kyc-flow.html` | `kyc-flow.mermaid` (spec completa) |
| Portfolio/dashboard | `Crocante Portfolio (offline).html` | `Crocante Portfolio User Flow (offline).html` |
| Activity | `Crocante Activity Prototype.standalone.html` | (el Flow es byte-idéntico) |
| Invest/Colocaciones | `Invest - Vault + Colocación (standalone).html` | `Flujo Invest - Vault + Colocación (standalone).html` |
| Cross-border | `Cross-border Prototype (standalone)-2.html` | `Cross-border User Flow (standalone).html` |
| Team & Roles | `Team & Roles.html` | `Team & Roles Flow.html` |

### 1.3 Cómo leer los prototipos (importante para el ejecutor)

Los HTML grandes (3-7 MB) son exports "bundled": la masa del archivo es base64 (fuentes Inter + Babel). **No leerlos enteros.** Estructura interna:

- `<script type="__bundler/template">` → el HTML real + CSS del design system (`<style id="ds-v23-inject">`).
- `<script type="__bundler/manifest">` → módulos JS embebidos (React 18 + código de la app).
- Dos generadores: **dc-runtime** (pantallas como `<div data-screen-label="…">` dentro de `<script type="text/x-dc">`; onboarding, cross-border, team) y **React a mano** (componentes nombrados en `text/babel`; portfolio, activity, invest).

Técnica: extraer el template con `grep`/`sed` o un script Node corto que parsee el JSON del template/manifest y lo vuelque a archivos legibles en un scratchpad; después trabajar sobre esos extractos. Buscar `data-screen-label`, nombres de componentes (`function Sidebar`, `HoldingsTable`, etc.) y los labels exactos listados en este documento.

---

## 2. El template: arquitectura de `crocante-pitch-frontend`

### 2.1 Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · **Tailwind v4 (CSS-first, tokens en `app/globals.css` vía `@theme`)** · React Query 5 · react-hook-form + zod · recharts · sonner · axios (pinned 1.13.5) · **Yarn**. Alias único `@/*` → raíz.

### 2.2 Patrón de capas (LA regla de oro)

Cada feature sigue exactamente esta estructura — replicarla para cada módulo nuevo:

```
app/(dashboard)/<ruta>/page.tsx          ← wrapper de ~5 líneas, "use client",
                                            solo renderiza la Section
domain/<feature>-section.tsx             ← wrapper flat que exporta <Feature>Section
domain/<feature>/
  ├── <feature>.tsx                      ← componente entry del módulo
  ├── components/                        ← piezas del módulo (kebab-case)
  └── hooks/                             ← hooks propios del módulo
services/hooks/use-<recurso>.ts          ← hook React Query por recurso
services/hooks/types/<recurso>-data.ts   ← tipo respuesta + getMocked<X>() + getFormatted<X>()
shared/mockups/<recurso>.ts              ← dataset mock estático
```

Referencia canónica: **`domain/portfolio/`** (el módulo más completo: header actions con `-action.tsx` + `-modal.tsx`, secciones left/right/bottom, ~8 hooks de datos). Imitar su granularidad.

Convenciones de código:
- Archivos **kebab-case**; componentes con `interface XProps` inline; `"use client"` en todo lo interactivo.
- Imports de UI compartida vía barrel: `import { Button, Modal, Table } from "@/components/index"`.
- Clases con `cn()` de `@/lib/utils` (twMerge + clsx). Tokens semánticos (`bg-card`, `text-muted-foreground`, `bg-primary`) — **no** hex hardcodeado ni `neutral-*` crudo en código nuevo.
- Mock-first: los hooks devuelven `getMocked…()` cuando `useSessionMode() === "mock"`. **Todo lo nuevo de este plan es mock-only** (no hay backend para estas pantallas todavía); dejar el branch `real` lanzando el fetch normal aunque el endpoint no exista aún.
- Formatters de `lib/utils.ts` (`formatCurrency`, etc.) para montos.

### 2.3 Qué reutilizar tal cual

- **Primitivas `components/core/`**: `button` (7 variantes), `card`, `input`, `label`, `select`, `radio-group`, `modal`, `table` + `table-filters`, `tabs`, `tooltip`, `toast`, `skeleton`, `loading-field`, `date-picker`, `dropzone`, `icon`.
- **Layout `components/layout/`**: `shell.tsx`, `header.tsx`, `nav-bar.tsx` (se modifican, no se reescriben).
- **Wizard de registro `components/auth/register/`**: 5 pasos (account, info, otp, documents, assets-origin) con `RegisterStepIndex` tipado, `register-header`/`register-nav` — es la base directa del onboarding + KYB.
- **Módulos con data layer real (`portfolio`, `credit`, `staking`, `activity`)**: NO romperlos. Son la referencia de patrón. La ruta actual `/portfolio` y `/activity` se reemplazan por las versiones nuevas (fase 3) manteniendo sus hooks/servicios existentes intactos en el árbol (los consumirá quien los necesite).
- Sistema mock: `useSessionMode`, `LocalStorageManager`, `shared/mockups/*`.

### 2.4 Deprecado / basura — no usar, no imitar (y limpiar en Fase 0)

- `domain/defi-section.tsx` — huérfano, sin ruta. **Borrar.**
- `domain/crocante-logo.tsx` + `public/crocante-logo.png` — nunca importados. **Borrar.**
- Assets del scaffold en `public/`: `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`, `placeholder*.{svg,jpg,png}`, `placeholder-logo.*`. **Borrar.**
- Directivas legacy `@tailwind base/components/utilities` en `globals.css` (redundantes bajo v4). **Quitar.**
- `components.json` (shadcn) es vestigial — no hay `components/ui/`; las primitivas son propias. **No introducir shadcn.**
- Deps instaladas sin uso (`@radix-ui/*` ~30 paquetes, `class-variance-authority`, `cmdk`, `embla-carousel-react`, `react-resizable-panels`, `next-themes`): **no importarlas en código nuevo**. No desinstalarlas en este plan (algunas pueden ser transitivas de flowbite-react); solo abstenerse.
- Páginas mock-only actuales (`custody`, `governance`, `reports`, `settings`, `invest`, `rfq-manager`): son prototipos inline con constantes gigantes — **el anti-patrón a evitar**. Sirven solo como referencia visual (p.ej. Settings→Users y Custody→RBAC para Team & Roles). Las nuevas versiones las reemplazan con la estructura de capas de §2.2.

---

## 3. Decisiones de diseño (ya tomadas — el ejecutor no las re-discute)

1. **Tokens:** portar el design system **DS v2.3** a `app/globals.css` (`@theme` de Tailwind v4). Primary indigo `#6665DD`, accent orange `#FC7336`, neutrales fríos `#FFFFFF→#0A0D0E`, success/warning/error/info con ramps 50-950, escala tipográfica Major Third (`xxs→display`), radius `sm 2 / md 4 / lg 8 / full`, sombras sm-xl. Mapear a los tokens semánticos existentes (`--primary`, `--accent`, `--card`, etc.) para no romper las pantallas viejas; agregar los que falten. Los valores exactos están en `Crocante DS v2.3.html` (light y dark).
2. **Dark mode:** los tokens dark de DS v2.3 se cargan en el bloque `.dark {}` ya existente, pero **no** se activa el toggle en este plan (queda listo para después).
3. **Iconos:** los prototipos usan Material Symbols. Mantener el approach actual del repo (SVGs propios en `components/icons/` + lucide ya disponible). Crear los iconos que falten como componentes SVG; **no** agregar la font de Material Symbols.
4. **Layout responsive, no stage fijo:** los prototipos renderizan en un stage 1440×1100 escalado. La implementación usa el `Shell` responsive existente (flex + `use-is-mobile`), no el scaler.
5. **Sin iframes:** la navegación por iframe de crocante-hifi se convierte en rutas del App Router dentro del route group `(dashboard)`.
6. **Idioma de copy:** respetar el idioma de cada prototipo (onboarding/team en inglés, KYB/invest/cross-border en español). Centralizar strings por módulo en un `constants.ts` del feature para facilitar i18n futura. No inventar traducciones.
7. **Estado:** wizard/steps con estado local + context por módulo si hace falta; persistencia ligera (env activo, checklist, KYB done) vía `LocalStorageManager` con claves nuevas en `LocalStorageKeys`.
8. **Auth real no cambia:** el BFF (`app/api/auth/*`, `lib/auth/`) y `SessionProvider` quedan intactos. Las pantallas de auth/onboarding nuevas son flujo visual mock encima de lo existente.
9. **Charts:** recharts (ya instalado) para hero/sparklines/donut. No portar los SVG a mano de los prototipos.
10. **Tamaño de archivos:** ningún componente nuevo >~250 líneas; ninguna constante mock inline en componentes (van a `shared/mockups/`). Si un componente crece, se parte.

---

## 4. Plan de ejecución por fases

> Cada fase = 1 commit como mínimo (mensaje `feat(scope): …` / `chore: …`). Criterio global de aceptación por fase: `yarn build` y `yarn lint` pasan; la app levanta con `yarn dev` y las rutas nuevas renderizan sin errores de consola.

### Fase 0 — Preparación y limpieza
1. Clonar/extraer los prototipos: script Node en scratchpad que parsee `__bundler/template` + `__bundler/manifest` de cada HTML de `Dashboard-Test` y vuelque HTML/JS legible por módulo (guardar extractos en scratchpad, NO commitearlos al repo).
2. Borrar lo listado en §2.4 (dead code + assets scaffold + directivas legacy de globals.css).
3. Verificar build tras la limpieza.

**Entregable:** repo limpio + extractos legibles de los 8 prototipos fuente.

### Fase 1 — Design tokens DS v2.3
1. Reescribir la paleta de `app/globals.css`: primitivas (neutral/primary/accent/success/warning/error/info 50-950) + semánticos light y dark + tipografía + radius + sombras, mapeados vía `@theme inline` a utilidades Tailwind.
2. Verificación visual rápida de las 4 pantallas reales existentes (portfolio, credit, staking, activity) — deben seguir siendo usables (van a cambiar de tinte: esperado y deseado).

**Entregable:** un solo source of truth de tokens = DS v2.3.

### Fase 2 — Primitivas faltantes (`components/core/` + `components/custom/`)
Crear siguiendo el estilo de las primitivas existentes (variantes como `Record<Variant, string>`, export en el barrel `components/index.ts`):

| Componente | Origen en DS/prototipos |
|---|---|
| `badge.tsx` (core; hoy hay uno en icons/) | DS Badges — status pills (`STATUS_PILL`) |
| `alert.tsx` | DS Alerts & Banners |
| `stepper.tsx` | wizards KYB / invest / transfer / add-recipient (pasos numerados + estado) |
| `drawer.tsx` (slide-over derecho) | Activity `DetailShell`, sub-accounts, fund detail |
| `empty-state.tsx` | Cross-border "¡Todavía no tienes destinatarios!" |
| `filter-chip.tsx` | Activity `FilterChip`, tablas |
| `type-tile.tsx` | Activity `TYPE_TILE` (icono cuadrado por tipo de tx) |
| `amount-input.tsx` (custom/) | input de monto grande compartido invest + transfers |
| `env-pills.tsx` (custom/) | switcher All/Spend/Save + atajos ⌘⇧A/O/T |
| `page-header.tsx` (layout/) | DS Page Header: título + quick actions |
| `wizard-shell.tsx` (custom/) | contenedor común de wizards (header + stepper + nav Back/Continue) — generalizar de `register-nav`/`register-header` |

**Entregable:** librería base completa; página de prueba temporal no necesaria (se validan al usarse en Fase 3+).

### Fase 3 — Shell y navegación
1. `components/layout/nav-bar.tsx`: sidebar unificada con la lista maestra del prototipo Portfolio (12 items): Portfolio, Activity, Team, Payroll, Cards, Cross-border, Taxes, Recipients, Custody, Invest, Staking, Credit. Badge de conteo pendiente (patrón "Approvals"). Footer: user chip + Contact support / Help center. Items sin módulo → deshabilitados o ruta stub.
2. `components/layout/header.tsx` + nuevo `page-header`: breadcrumb/título + env-pills + quick actions (Send / Transfer / Deposit).
3. Estado de environment (`all/sp/sv`) en un context nuevo `context/environment-context.tsx`, persistido en localStorage.
4. Rutas nuevas en `app/(dashboard)/`: `team`, `cross-border`, `recipients`, más las que se reemplazan. `MENU_ITEMS`: decidir visibilidad por `SESSION_MODE` igual que hoy (las nuevas pantallas mock-only van al menú mock hasta tener backend; mantener las 4 reales en el menú real).
5. Stub genérico único (`domain/stub-section.tsx`) para Payroll/Cards/Taxes.

**Entregable:** navegación completa del producto con stubs; `Shell.getPageTitle` cubre todas las rutas.

### Fase 4 — Portfolio (pantalla default)
Fuente: `Crocante Portfolio (offline).html`. Reemplaza el contenido de `/portfolio`.
1. `domain/portfolio-v3/` (no pisar `domain/portfolio/` existente hasta el final de la fase; al terminar, la ruta apunta al nuevo y el viejo queda como fuente de hooks reutilizados):
   - `components/`: `hero.tsx` (balance grande + delta), `balance-chart.tsx` (recharts area), `quick-actions.tsx` (Send/Statement/Add funds/Transfer/Invest/Credit/Policy/Swap/Deposit), `holdings-table.tsx`, `accounts-table.tsx`, `activity-feed.tsx`, `sub-account-drawer.tsx`, `onboarding-checklist.tsx` (4 pasos create/kyb/invite/fund), modales `add-funds-modal.tsx`, `create-account-modal.tsx`, `transfer-modal.tsx`.
   - Vistas por environment (`all`/`sp`/`sv`) como composición, no como tres pantallas duplicadas.
2. Mocks: `shared/mockups/portfolio-v3.ts` (holdings, accounts, activity feed) + types con `getMocked…`/`getFormatted…`.
3. Interacciones: drill-in a sub-account, env switcher tiñendo datos, checklist persistente.

**Criterio:** paridad de pantalla con el prototipo (secciones, labels, jerarquía) en los tres environments.

### Fase 5 — Activity
Fuente: `Crocante Activity Prototype.standalone.html`. Reemplaza `/activity`.
1. `domain/activity-v3/`: `activity-table.tsx` (filas por tipo con `type-tile` + status pill), `filter-bar.tsx` (chips All/tipo/estado), `activity-drawer.tsx` (DetailShell + `d-section`/`d-row` genéricos), paneles de detalle por tipo (11 tipos: staking, withdraw, deposit, trade, transfer, fx swap, onramp, credit, governance, fiat deposit, fiat withdraw) — un componente por tipo, cortos, o un panel genérico configurado por tipo si la variación es solo de campos.
2. Approvals multi-firma: `approval-row.tsx` + acción "Firmar" (decrementa firmas requeridas, toast "Firmaste · … (n/required)", pending→completed).
3. Mocks: `shared/mockups/activity-v3.ts` con el modelo `ALL_ACTIVITY` (id/type/label/dir/asset/date/amount/secondary/status) + `INITIAL_APPROVALS`.

**Criterio:** filtros funcionan, drawer abre/cierra (ESC incluido), flujo de firma completo con toast.

### Fase 6 — Onboarding + KYB
Fuentes: `Crocante Prototype (standalone).html` (pantallas 01-12) + `kyc-flow.html`/`.mermaid`.
1. Onboarding (rutas públicas `app/onboarding/…` o grupo `(onboarding)`): pantallas Landing → Create account → Verify email → Confirm → OTP → Workspace name → Verify entity. Reutilizar/extender `components/auth/register/` (steps account/otp ya existen); el wizard nuevo orquesta con `wizard-shell`.
2. KYB (`/kyb` dentro del dashboard, + gate): `domain/kyb/` con los 3 pasos como componentes (`step-company.tsx` con sub-tabs datos/cuenta, `step-documents.tsx` con sub-tabs documentos/patrimonial + `dropzone` + modal duplicado + validación 3/3 y ≥1 patrimonial + checkboxes PEP/sujeto obligado, `step-confirm.tsx` con review + T&C). Estados post-submit: en-proceso / aprobado / info-adicional / rechazado (con re-submit). Seguir el mermaid al pie de la letra para las ramas.
3. Gate: overlay en el layout `(dashboard)` cuando `kybStatus !== "approved"` (localStorage), patrón crocante-hifi. Bypass obvio para desarrollo (query param o SESSION_MODE mock con estado aprobado por defecto en el mock).
4. Product tour: modal 3 pasos post-KYB con Skip (estado en localStorage).

**Criterio:** flujo completo navegable end-to-end desde landing hasta dashboard desbloqueado; todas las ramas del mermaid alcanzables.

### Fase 7 — Invest / Colocaciones
Fuente: `Invest - Vault + Colocación (standalone).html`. Reemplaza `/invest` (la versión inline mock actual).
1. `domain/invest-v3/`: `vault-picker.tsx` (lista de vaults curados, "Crocante" live destacado), `fund-detail.tsx` (performance, ficha técnica, documentación, límites — drawer o ruta `/invest/[slug]` reutilizando el patrón `funds/[slug]` existente), `placement-wizard.tsx` con 4 pasos (`activo → monto → plazo/tasa → revisión`) + memo/reference + confirmación → estado executed → volver a lista.
2. Ramas del `Flujo Invest…`: asset-not-found, monto inválido, editar desde revisión.
3. Mocks: vaults, tasas por plazo (Flexible, 30/90/180/365 con multiplicadores TEA), posiciones activas.

**Criterio:** wizard completo con validaciones y ramas; tabla de posiciones activas post-confirmación.

### Fase 8 — Cross-border (transfers + recipients)
Fuente: `Cross-border Prototype (standalone)-2.html`.
1. `/recipients` → `domain/recipients/`: empty state → lista con búsqueda → wizard add-recipient (país → CBU/CVU/alias → confirmar cuenta detectada → detalles → review) con labels exactos del prototipo.
2. `/cross-border` → `domain/cross-border/`: wizard transferencia (¿A quién? → ¿Cuánto? con `amount-input` + selector moneda + referencia opcional → Revisa tu transferencia → Transferencia enviada).
3. Mocks: destinatarios, monedas/rates.

**Criterio:** ambos wizards end-to-end; agregar destinatario desde el flujo de transfer también funciona.

### Fase 9 — Team & Roles
Fuente: `Team & Roles.html`. Ruta `/team` → `domain/team/`.
1. Tabs Team / Roles. Team: tabla de miembros (filtros All / Needs review / Add filter; acciones Edit/More/Remove), botón `Invite ▾` (single/multiple).
2. Wizard invite: datos → rol (assign role) → Review & send → Invitation sent.
3. Roles: cards de roles + Create new role (name, description, template).
4. Referencia visual complementaria: Settings→Users y Custody→RBAC actuales (solo inspiración de tabla/matriz).

**Criterio:** tabla + ambos wizards + creación de rol funcionando sobre mocks.

### Fase 10 — Integración, QA y cierre
1. Revisar coherencia transversal: env switcher afecta Portfolio/Activity; badge de approvals en sidebar refleja `INITIAL_APPROVALS` pendientes; quick actions del header enlazan a los flujos (Send→cross-border, Deposit→add-funds, Transfer→transfer-modal).
2. Barrido de tamaño: ningún archivo nuevo >~250 líneas; mocks fuera de componentes; sin hex hardcodeado.
3. `yarn build` + `yarn lint` + smoke test manual de cada ruta en los 3 environments y en mobile (`use-is-mobile`).
4. Actualizar `README.md` con el mapa de rutas/módulos nuevo.
5. Borrar `domain/invest-section.tsx` viejo y cualquier sección inline reemplazada que haya quedado huérfana (verificar con grep de imports antes de borrar).

---

## 5. Reglas para el ejecutor

1. **No tocar:** `app/api/auth/*`, `lib/auth/`, `services/api/`, `context/session-provider.tsx`, el proxy dev, ni los hooks de datos reales existentes.
2. **Mock-first estricto:** ninguna pantalla nueva llama endpoints; todo dato entra por el patrón `use-<recurso>` → `getMocked…()`.
3. **Fidelidad de labels:** los textos de botones/headings listados en §1 y en los prototipos se copian exactos (incluido el idioma de cada módulo).
4. **Un commit por fase mínimo**, mensajes convencionales, push a la rama de trabajo al final de cada fase.
5. **Ante ambigüedad visual** (el extracto del prototipo no alcanza): decidir por consistencia con DS v2.3 y el patrón del módulo Portfolio existente; anotar la decisión en el commit body. No bloquear.
6. **No introducir dependencias nuevas** sin justificación fuerte; el stack actual cubre todo (recharts, react-hook-form, zod, sonner, flowbite-datepicker).
7. Los extractos de los prototipos y scripts auxiliares viven en el scratchpad, **nunca se commitean**.

---

## 6. Resumen de rutas resultantes

| Ruta | Estado | Módulo |
|---|---|---|
| `/onboarding/*` | nueva | auth/onboarding wizard (01-08 + tour) |
| `/kyb` | nueva | wizard KYB 3 pasos + estados |
| `/portfolio` | reemplazada | portfolio-v3 (default, redirect desde `/`) |
| `/activity` | reemplazada | activity-v3 |
| `/invest` (+ `/invest/[slug]`) | reemplazada | invest-v3 / colocaciones |
| `/cross-border` | nueva | transfer wizard |
| `/recipients` | nueva | destinatarios |
| `/team` | nueva | team & roles |
| `/payroll`, `/cards`, `/taxes` | nuevas (stub) | stub-section |
| `/custody`, `/staking`, `/credit` | se mantienen | existentes (custody sigue mock-only) |
| `/governance`, `/reports`, `/settings`, `/rfq-manager` | se mantienen | existentes mock-only (fuera de scope) |
