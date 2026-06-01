# Cerebro - Toxic Financial Coach 🧠

## Estado del Proyecto
- **Fase Actual**: 1 & 2 Completadas (Motor Gemini Integrado)
- **Tecnologías**: React, Vite, TS, Tailwind v4, Framer Motion, Dexie.js.
- **Arquitectura**: Client-side (IndexedDB) + Vercel Edge Proxy.
- **IA**: Google Gemini 1.5 Flash (Gratis y Rápido).
- **GitHub**: https://github.com/manualecarvajal-collab/toxic-financial-coach

## Hitos Logrados
- [x] Motor Gemini 1.5 Flash integrado en Vercel Edge.
- [x] Base de datos local con Dexie.js.
- [x] Social Shame Card operativa.
- [x] Build de producción verificada.

## Próximos Pasos (En Vercel)
1. Importar el repositorio en Vercel.
2. Configurar la Variable de Entorno en **Vercel Dashboard → Project → Settings → Environment Variables**:
   - `GEMINI_API_KEY` = tu API key de Google AI Studio
   - **NO** agregar `VITE_API_URL` (se usa URL relativa)
3. Re-deployar después de configurar la variable.
4. ¡Listo para humillar!

## Decisiones Técnicas Clave
- **Gemini 1.5 Flash**: Elegido por su capa gratuita superior y velocidad de respuesta.
- **JSON Mode**: Forzamos a Gemini a responder en formato JSON estructurado para mayor robustez.

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

