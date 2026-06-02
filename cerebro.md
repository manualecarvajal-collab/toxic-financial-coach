# Cerebro - Toxic Financial Coach 🧠

## Estado del Proyecto
- **Fase Actual**: 5 — MVP + APK Android
- **Tecnologías**: React, Vite, TS, Tailwind v4, Dexie.js, Capacitor Android.
- **Arquitectura**: Client-side (IndexedDB) + Vercel Edge Proxy + APK (Capacitor WebView).
- **IA**: Google Gemini 2.5 Flash Lite + Google Cloud Text-to-Speech.
- **Voz**: `es-US-Wavenet-B` (masculino mexicano, vía Google Cloud TTS).
- **Bundle**: ~343 KB (sin Three.js) + APK ~12 MB.
- **GitHub**: https://github.com/manualecarvajal-collab/toxic-financial-coach

## Hitos Logrados
- [x] Motor Gemini 2.5 Flash Lite integrado en Vercel Edge.
- [x] Base de datos local con Dexie.js.
- [x] Social Shame Card operativa (descargable/compartible).
- [x] Build de producción verificada.
- [x] Rediseño brutalista completo (scanlines, noise, Anton, border-8).
- [x] Full-screen expense form con bento grid de categorías.
- [x] Sistema de comentarios inteligentes (24+ variantes por categoría/monto).
- [x] Flicker fix para Tecno Spark 20 / MediaTek.
- [x] Mock roasts con replaceAll + 4 variantes de empty state.
- [x] Burla automática al agregar gasto (sin botón manual).
- [x] Prompt engineering: 4 personalidades dinámicas + few-shot + temperatura 0.85.
- [x] TTS con Google Cloud (`es-US-Wavenet-B`, voz mexicana masculina).
- [x] Fallback a Web Speech API si falta TTS_API_KEY.
- [x] Proxy `api/speak.ts` en Vercel para Google Cloud TTS.
- [x] Eliminación de personaje 3D (modelo sin jaw bone, no daba calidad).
- [x] Eliminación de bottom navigation (bloqueaba FAB).
- [x] Capacitor Android instalado y configurado (`com.toxicfinancial.coach`).
- [x] APK debug generado y funcional (`app-debug.apk` ~12 MB).

## Próximos Pasos (En Vercel)
1. Importar el repositorio en Vercel.
2. Configurar la Variable de Entorno en **Vercel Dashboard → Project → Settings → Environment Variables**:
   - `GEMINI_API_KEY` = tu API key de Google AI Studio
   - **NO** agregar `VITE_API_URL` (se usa URL relativa)
3. Re-deployar después de configurar la variable.
4. ¡Listo para humillar!

## Decisiones Técnicas Clave
- **Gemini 2.5 Flash Lite**: Reemplazo de 1.5 Flash (shutdown). Costo eficiente, buena velocidad.
- **JSON Mode**: Forzamos a Gemini a responder en formato JSON estructurado para mayor robustez.
- **Prompt dinámico**: `selectPersona()` elige entre 4 moods según monto/cantidad de gastos.
- **Few-shot**: 3 ejemplos inline en el prompt para guiar tono y estructura.
- **Temperatura 0.85**: Balance entre creatividad y coherencia.

## Rediseño Brutalista (Junio 2026)

### Problema
El diseño original era funcional pero plano y sin personalidad. No reflejaba el tono sarcástico/agresivo de la app. El usuario reportó que se sentía "básico".

### Solución
Rediseño completo inspirado en **brutalismo digital** (Anton, bordes gruesos, scanlines, noise, tipografía extrema).

### Cambios realizados

**Fundación (`index.html`, `index.css`):**
- Agregada Google Font `Anton` para títulos de alto impacto
- `@theme` en Tailwind v4 expandido:
  - +4 colores: `toxic-orange`, `toxic-purple`, `toxic-yellow`, `toxic-dark-alt`
  - +5 familias fuentes: `font-display` (Anton), `font-data` (JetBrains Mono), etc.
  - +7 tamaños de texto: `display-xl` (96px), `display-lg` (36px), `data-heavy` (28px), etc.
  - +8 spacings: `safe-margin`, `stack-*`, `grid-gutter`, `border-bold/thin`
  - Nuevas utilidades CSS: `.scanline` (CRT scanlines), `.diagonal-pattern`, `.noise-bg`, `.glitch:hover`, `.fab-pulse`, `.truncate-heading`

**Componentes:**

| Componente | Antes | Después |
|------------|-------|---------|
| `Header.tsx` | Flame icon, botón Roast/Clear | Scanlines, "ESTADO DE POBREZA" en Anton yellow, botón "Burla" rojo, Trash2 |
| `StatsCards.tsx` | Cards redondeadas, iconos, hover:scale | `border-l-[8px]` coloreado, `diagonal-pattern`, data-heavy |
| `ExpenseList.tsx` | Cards con hover:scale | `border-l-8` según toxicidad, `truncate`, sin hover (evita flicker) |
| `ExpenseForm.tsx` | Popup small con inputs | **Pantalla completa**: noise+scanlines overlay, bento grid categorías, "CONFIRMAR GASTO ESTÚPIDO" |
| `RoastModal.tsx` | Modal limpio | `noise-bg`, border-4 en grade badge, tipografía más agresiva |
| `App.tsx` | Layout simple | **BottomNav** (DEUDA/GASTOS/BURLA/INTEL), Hero "Estás en Quiebra" scanline |
| `format.ts` | `getSarcasticComment` con 6 frases estáticas | **Comentarios inteligentes**: 8 categorías + 5 tiers + selección aleatoria |

**Flujo de navegación:**
- DEUDA → lista de gastos (home)
- GASTOS → análisis de derroche (placeholder)
- BURLA → genera roast con IA (manual / regeneración)
- INTEL → inteligencia financiera (placeholder)
- FAB (+) → pantalla completa de nuevo gasto → **auto-genera burla al confirmar**
- Header → botón "Burla" genera roast con gastos actuales

### Archivos de diseño
- `stitch-redesign.md` — Brief original para Stitch
- `stitch-redesign.html` — Diseño de referencia generado por Stitch

## Logros Técnicos

### Sistema de comentarios inteligentes (`getSarcasticComment`)
- **3 pools independientes** por categoría (8 categorías × 3 comentarios = 24)
- **5 tiers** por monto (extreme/high/medium/low/free × ~5 cada uno = 24)
- **Selección 50/50** entre comentario categorizado o genérico
- **Cada visita/recarga** genera texto diferente (`Math.random()`)
- Incluye el nombre del gasto y la categoría en el texto generado
- Backwards compatible: acepta `(amount, category?, description?)`

### StatsCards dinámicos
- Cada card tiene arrays de 3 comentarios. Se elige 1 aleatorio cada render.
- Ej: `WEEKLY_COMMENTS`, `WASTE_COMMENTS`, `MOOD_COMMENTS`, `REMAINING_COMMENTS`

## Bugs Conocidos

### [P1] Flicker en Tecno Spark 20 (Android)
- **Síntoma**: Parpadeo/flicker en pantalla al cargar la página. Solo ocurre en Tecno Spark 20 con Chrome. No ocurre en PC ni en otros celulares Android.
- **Se arregla al**: Agregar un gasto a la lista (dispara re-renders que fuerzan al browser a recomponer los GPU layers correctamente).
- **Causa raíz**: Chrome en dispositivos MediaTek/PowerVR (gama de entrada) tiene bugs con la composición de GPU layers en el paint inicial. Los elementos con `transition-all`, `hover:scale-*` (transform), y `position: fixed` (FAB) disparan la creación de GPU compositor layers que fallan en el primer render.
- **Solución**:
  1. `src/index.css` — Agregar `backface-visibility: hidden` y `-webkit-backface-visibility: hidden` en `html`. Fuerza a Chrome a crear un GPU layer estable desde el paint inicial (fix clásico para flickering en Chrome Android con GPUs problemáticas).
  2. `src/index.css` — Agregar `min-height: 100dvh` con fallback `100vh` en `html, body` para evitar reflow de la address bar.
  3. `src/App.tsx` — Cambiar `min-h-screen` → `min-h-[100dvh]` para usar dynamic viewport height.
- **Estado**: ✅ Corregido

### [P3] Gemini 1.5 Flash shut down (404)
- **Síntoma**: La API devolvía `models/gemini-1.5-flash is not found for API v1beta`.
- **Causa raíz**: Google dio de baja todos los modelos Gemini 1.5 en 2025.
- **Solución**: Migrar a `gemini-2.5-flash-lite` en `api/roast.ts`.
- **Estado**: ✅ Corregido

### [P4] Roast siempre con los mismos 4 textos mock
- **Síntoma**: El usuario veía siempre los mismos 4 textos ("MOCK" en el modal).
- **Causa raíz**: La API de Gemini fallaba (modelo shutdown + error en system_instruction) y el frontend caía a `MOCK_ROASTS`.
- **Solución**:
  1. Cambiar modelo a `gemini-2.5-flash-lite`.
  2. Eliminar `system_instruction` (no soportado correctamente con responseMimeType) → inline prompt.
  3. Agregar badge IA/MOCK en el modal para debugging visual.
  4. Pasar `_debug` con el mensaje de error real cuando cae a mock.
- **Estado**: ✅ Corregido

### [P2] Roast duplicado / error al generar con gastos
- **Síntoma**: "Siempre aparece la misma frase cuando no hay gastos" y "cuando agrego un gasto me da un error".
- **Causa raíz**:
  1. Sin gastos: Respuesta hardcodeada única en `ai.ts:104-109`. Siempre devolvía el mismo texto.
  2. Con gastos: El backend `api/roast.ts` devolvía `status(200)` incluso cuando Gemini fallaba, mostrando siempre el mensaje "💀 Incluso la IA...". El frontend lo trataba como roast válido.
  3. Los mock roasts usaban `.replace()` (solo 1era ocurrencia), algunos roasts usaban `${total}` 2 veces y solo se reemplazaba el primero.
  4. `.env.example` tenía `VITE_API_URL=http://localhost:5173` — si se copiaba a `.env` y se deployaba, el build apuntaba a localhost en producción.
- **Solución**:
  1. `src/services/ai.ts` — Reemplazar hardcode por array `EMPTY_ROASTS` con 4 variantes y selección aleatoria.
  2. `api/roast.ts` — Cambiar `status(200)` → `status(500)` para que el frontend caiga a mocks variados.
  3. `src/services/ai.ts` — Cambiar `.replace()` → `.replaceAll()` para reemplazar TODAS las ocurrencias de `${total}` y `${count}`.
  4. `.env.example` — Comentar `VITE_API_URL` (con URL relativa funciona en dev y prod).
- **Estado**: ✅ Corregido

