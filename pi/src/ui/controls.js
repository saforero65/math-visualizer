/**
 * Crear controles táctiles para móvil
 */
export function createTouchControls() {
    const controlsDiv = document.createElement('div')
    controlsDiv.id = 'touch-controls'
    controlsDiv.innerHTML = `
        <button id="btn-play" class="control-btn" aria-label="Play/Pause">
            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
        </button>
        <button id="btn-reset" class="control-btn" aria-label="Reset">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
        </button>
    `
    document.body.appendChild(controlsDiv)

    return {
        btnPlay: document.getElementById('btn-play'),
        btnReset: document.getElementById('btn-reset')
    }
}

/**
 * Sincronizar estado del botón play
 */
export function updatePlayButton(btnPlay, isPlaying) {
    btnPlay.classList.toggle('playing', isPlaying)
}
