/**
 * Normalización de teléfonos argentinos a formato internacional.
 *
 * Lo usan Meta (que espera solo dígitos, sin "+") y WhatsApp Cloud API.
 * Argentina mete dos ruidos propios: el 0 de larga distancia y el 15 de celular.
 *
 * Todos estos tienen que salir como 5493413067158:
 *   +54 9 341 306-7158 · 0341 15 306-7158 · 341 306 7158 · (0341) 306-7158
 */
export function normalizarTelefonoAR(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("54")) {
    const rest = digits.slice(2);
    // 54 + 9 + 10 dígitos ya está bien; 54 + 10 le falta el 9 de celular
    return rest.startsWith("9") ? digits : `549${rest}`;
  }
  if (digits.startsWith("0")) digits = digits.slice(1);

  // El "15" del celular local va pegado después del código de área, y el código
  // de área argentino puede tener 2, 3 o 4 dígitos (11 / 341 / 2954). Un número
  // con 15 queda en 12 dígitos, así que buscamos el 15 en las tres posiciones
  // posibles y sacamos la que deje un número válido de 10.
  if (digits.length === 12) {
    const posiciones = digits.startsWith("11") ? [2, 3, 4] : [3, 4, 2];
    for (const i of posiciones) {
      if (digits.slice(i, i + 2) === "15") {
        digits = digits.slice(0, i) + digits.slice(i + 2);
        break;
      }
    }
  }

  if (digits.length === 10) return `549${digits}`;
  // Cualquier otro largo: se manda tal cual, el destino lo descarta si no matchea
  return digits;
}
