/**
 * Formatea un número como moneda
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Formatea una fecha en formato corto
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Genera un color basado en el monto (más rojo = más caro)
 */
export function getToxicityColor(amount: number): string {
  if (amount > 1000) return 'text-toxic-red';
  if (amount > 500) return 'text-orange-500';
  if (amount > 100) return 'text-yellow-500';
  return 'text-toxic-green';
}

/**
 * Genera un comentario sarcástico basado en el monto
 */
export function getSarcasticComment(amount: number): string {
  if (amount > 5000) return '¿Te sobra el dinero o qué?';
  if (amount > 1000) return 'Espero que haya valido la pena...';
  if (amount > 500) return 'Podrías haber ahorrado esto.';
  if (amount > 100) return 'Un cafecito. O varios.';
  if (amount > 0) return 'Bueno, al menos no quebraste.';
  return 'Gratis. La única palabra bonita.';
}

/**
 * Obtener el día de la semana como string
 */
export function getDayOfWeek(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[d.getDay()];
}