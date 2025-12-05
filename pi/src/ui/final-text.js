/**
 * Crear mensaje final
 */
export function createFinalText() {
    const finalText = document.createElement('div')
    finalText.id = 'final-text'
    finalText.innerHTML = `
        <div class="pi-symbol">π</div>
        <div class="message">
            La constante que conecta lo finito con lo infinito
        </div>
    `
    document.body.appendChild(finalText)
}

/**
 * Mostrar mensaje final
 */
export function showFinalText() {
    document.getElementById('final-text').classList.add('visible')
}

/**
 * Ocultar mensaje final
 */
export function hideFinalText() {
    document.getElementById('final-text').classList.remove('visible')
}
