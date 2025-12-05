/**
 * Estado global de la animación
 */
export const state = {
    phase: 1,              // Fase actual (1 o 2)
    sides: 3,              // Número de lados del polígono
    radius: 1.2,           // Radio del polígono/círculo
    piApprox: 4,           // Aproximación actual de π
    autoPlay: false,       // Reproducción automática
    speed: 0.5,            // Velocidad de animación

    // Fase 2: Revolución
    revolutionSteps: 0,    // Pasos de revolución mostrados
    maxRevolutionSteps: 45, // Máximo de círculos en la revolución
    showAxis: false,        // Mostrar eje de revolución
}

// Secuencia de Fibonacci precalculada para aceleración
export const fibonacciSequence = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]

/**
 * Obtener incremento basado en Fibonacci según el número actual de lados
 */
export function getFibonacciIncrement(currentSides) {
    if (currentSides <= 40) return fibonacciSequence[2]   // +2
    if (currentSides <= 50) return fibonacciSequence[3]   // +3
    if (currentSides <= 60) return fibonacciSequence[4]   // +5
    if (currentSides <= 80) return fibonacciSequence[5]   // +8
    if (currentSides <= 100) return fibonacciSequence[6]  // +13
    if (currentSides <= 130) return fibonacciSequence[7]  // +21
    if (currentSides <= 170) return fibonacciSequence[8]  // +34
    return fibonacciSequence[9]                            // +55
}
