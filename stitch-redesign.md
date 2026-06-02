# Toxic Financial Coach — Rediseño Brutalista 🧨

## Descripción del Proyecto

App web progresiva para registrar gastos con un coach financiero sarcástico impulsado por IA.
El diseño actual es funcional pero plano y sin personalidad. Necesita reflejar el **tono agresivo, sarcástico e irreverente** de la app.

---

## Dirección de Diseño

**Brutalista / Raw** — Tipografía enorme, bordes gruesos, colores planos con alto contraste, texturas sucias, actitud agresiva. Nada de sutilezas, nada de "clean design". Esto es un puñetazo visual.

Inspiración visual:
- Pósters de bandas de punk/metal
- Diseño editorial de los 90 (Ray Gun, Emigre)
- Interfaces de terminal retro con actitud moderna
- Juegos como Hotline Miami o Katana ZERO

---

## Paleta de Colores

### Base (se mantiene)
| Token | Color | Uso |
|-------|-------|-----|
| `--toxic-black` | `#050505` | Fondo principal |
| `--toxic-green` | `#39FF14` | Verde neón (acciones positivas, aceptar, montos bajos) |
| `--toxic-red` | `#FF3131` | Rojo tóxico (alertas, montos altos, peligro) |

### Nuevos (evolución)
| Token | Color | Uso |
|-------|-------|-----|
| `--toxic-orange` | `#FF6B35` | Naranja ácido (montos medios-altos, acentos secundarios) |
| `--toxic-purple` | `#8B5CF6` | Púrpura (toques de locura, backgrounds alternativos) |
| `--toxic-yellow` | `#FBBF24` | Amarillo (avisos, montos medios) |
| `--toxic-dark-alt` | `#1A1A2E` | Gris oscuro (cards alternativas, fondos secundarios) |
| `--toxic-gray` | `#2A2A2A` | Gris base para superficies (actual: #1A1A1A → subir brillo) |

### Degradados clave
- `toxic-green → toxic-purple` (optimista → caótico)
- `toxic-red → toxic-orange` (peligro → advertencia)
- `toxic-black → toxic-dark-alt` (profundidad de fondo)

---

## Tipografía

### Títulos
- **Fuente**: `Anton` (Google Fonts) — ultra bold, compacta, de alto impacto
- **Tamaños**: Usar `text-5xl` a `text-8xl` donde antes se usaba `text-lg` a `text-2xl`
- **Tracking**: `tracking-tighter` en general, pero `tracking-[0.2em]` en etiquetas

### Cuerpo
- **Fuente**: `Inter` (se mantiene), pesos `700` (bold) y `900` (black) principalmente
- **Tamaños**: `text-sm` para cuerpo, `text-xs` y `text-[10px]` para metadata

### Monoespaciada
- **Fuente**: `JetBrains Mono` (se mantiene), pesos `400` y `700`
- **Tamaños**: `text-sm` para montos, `text-xs` para fechas

---

## Layout

### Estructura general
- **Ancho máximo**: `max-w-lg` se mantiene pero contenido más denso
- **Padding**: Reducir `px-4` → `px-3` en móvil, `pb-32` → `pb-28`
- **Bordes**: Todos los bordes de `border` → `border-2` o `border-4`
- **Esquinas**: Mantener `rounded-xl` pero considerar `rounded-none` en algunos elementos (más raw)

### Header
- **Altura**: Más compacto (`py-3` en vez de `py-4`)
- **Fondo**: Agregar textura `scanlines` con CSS (rayas horizontales finas semi-transparentes)
- **Logo**: "TOXIC" en `text-4xl font-black italic tracking-tighter`, "COACH" en verde
- **Subtítulo**: Texto más pequeño, casi críptico, estilo terminal
- **Botones**: Bordes gruesos (`border-2`), sin relleno bg, solo border + texto
- **Línea divisoria**: Degradado más agresivo (green→purple→transparent)

### StatsCards (Grid 2x2)
- **Bordes**: `border-4` en vez de `border`, cada card con borde coloreado
- **Tamaño icono**: `size={16}` → `size={24}`
- **Título**: `text-[10px]` → `text-xs`, tracking más suelto
- **Valor**: `text-2xl` → `text-4xl font-black font-mono`
- **Comentario**: `text-[9px]` → `text-xs italic`
- **Fondo**: Patrón diagonal sutil (CSS diagonal stripes)
- **Espaciado**: Menos padding interno (`p-4` → `p-3`)

### ExpenseList
- **Items**: Borde izquierdo grueso (`border-l-4`) coloreado según `getToxicityColor`
- **Hover**: Eliminar `hover:scale-[1.01]` (no es mobile-friendly, causa flicker en Android)
- **Fondo**: Alternar entre `bg-toxic-gray/30` y `bg-toxic-dark-alt/30`
- **Categoría**: Emoji más grande (`text-lg` → `text-2xl`)
- **Descripción**: `text-sm` → `text-base font-bold`
- **Monto**: `font-mono font-black` con color según toxicidad
- **Botón eliminar**: Siempre visible (no solo en hover), en la esquina superior derecha
- **Espaciado entre items**: `space-y-2` → `space-y-1`

### ExpenseForm (FAB)
- **Botón FAB**: `w-14 h-14` → `w-16 h-16`
- **Ícono**: `size={28}` → `size={32}`
- **Sombra**: `shadow-toxic-green/20` → `shadow-toxic-green/40` (más intensa)
- **Pulso**: Animación de pulso suave (sin interrumpir interacción)
- **Form expandido**: `border` → `border-2`, input de monto en `text-3xl font-black font-mono`
- **Inputs**: Mismos cambios de borde, placeholder en uppercase

### RoastModal
- **Overlay**: Fondo con textura grain (CSS noise) en vez de color sólido
- **Header**: Título en tracking más extremo
- **Grade badge**: `text-lg` → `text-3xl` con `border-4`
- **Texto del roast**: Caja con `border-2` y fondo semi-transparente
- **Useless fact**: Icono más presente
- **Loading state**: Esqueletos con animación más agresiva (glitch en vez de pulse)

### Empty State
- **Ícono**: `size={48}` → `size={96}` con color más llamativo
- **Texto principal**: `text-sm` → `text-2xl font-black`
- **Subtítulo**: `text-xs` → `text-sm`

### Shame Card (para exportar)
- **No rediseñar**: Se genera como imagen, cambios mínimos. Solo ajustar tipografía y bordes para que sea coherente.

---

## Interacciones y Micro-animaciones

### Al cargar página
- Stats hacen count-up animado de 0 al valor final
- Header tiene fade-in con slide hacia abajo

### Al agregar gasto
- Feedback visual: destello breve verde/rojo según el monto
- La lista hace scroll suave al nuevo elemento

### Al eliminar gasto
- El item se desvanece con slide hacia la derecha
- Reducción suave del espacio

### Botón Roast
- Al presionar: el botón se transforma en spinner in-situ
- Modal aparece con scale de 0.95 → 1

### Efecto Glitch (Header)
- Al pasar cursor sobre "TOXIC" (desktop) o al cargar (mobile):
  - Desplazamiento de capas RGB tipo CRT glitch
  - Solo CSS, sin JS, usando pseudo-elementos y animation

### FAB
- Animación de entrada: slide up + fade cuando se monta
- Pulso sutil (opacity) cada 2 segundos para llamar la atención

---

## Especificaciones Técnicas

### CSS a implementar

```css
/* Scanlines para header */
.scanlines {
  position: relative;
  overflow: hidden;
}
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255,255,255,0.03) 2px,
    rgba(255,255,255,0.03) 4px
  );
  pointer-events: none;
}

/* Efecto glitch en títulos */
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -1px); }
  60% { transform: translate(-1px, 1px); }
  80% { transform: translate(1px, -2px); }
  100% { transform: translate(0); }
}
.glitch:hover {
  animation: glitch 0.3s infinite;
}

/* Patrón diagonal para cards */
.diagonal-pattern {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255,255,255,0.02) 10px,
    rgba(255,255,255,0.02) 11px
  );
}
```

### Tailwind v4 — Nuevos tokens

Agregar en `src/index.css` dentro de `@theme`:

```css
--color-toxic-orange: #FF6B35;
--color-toxic-purple: #8B5CF6;
--color-toxic-yellow: #FBBF24;
--color-toxic-dark-alt: #1A1A2E;
```

---

## Assets Externos

- **Google Fonts**: Agregar `Anton` a los links en `index.html`
- **Íconos**: Se mantienen `lucide-react` (ya instalado)
- **No se requieren imágenes**: Todo es CSS puro

---

## Notas para Stitch

- Generar diseño visual (Figma o simil) para cada componente listado
- Priorizar mobile-first (375px - 430px de ancho)
- Incluir variantes de estado (vacíos, con datos, hover, active, loading)
- El diseño debe sentirse "incómodo" e "irreverente" — si se ve demasiado limpio, no sirve
- Mantener accesibilidad: contraste suficiente, hit targets de al menos 44px
- Recordar que el contenido principal son los gastos del usuario — no opacar la data con decoración excesiva
