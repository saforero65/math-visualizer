/**
 * Crear panel de información
 */
export function createInfoPanel() {
    // Cargar KaTeX
    const katexCSS = document.createElement('link')
    katexCSS.rel = 'stylesheet'
    katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
    document.head.appendChild(katexCSS)

    const katexScript = document.createElement('script')
    katexScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js'
    document.head.appendChild(katexScript)

    const infoDiv = document.createElement('div')
    infoDiv.id = 'pi-info'
    infoDiv.innerHTML = `
        <div class="phase-indicator">FASE 1</div>
        <div class="pi-display">
            <span class="pi-symbol-small">π</span>
            <span class="pi-approx">≈</span>
            <span id="pi-value">2.828427</span>
        </div>
        <div class="stats">
            <div class="stat-row">
                <span class="stat-label">Lados</span>
                <span id="sides-value" class="stat-value">4</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Error</span>
                <span id="error-value" class="stat-value">9.97%</span>
            </div>
            <div class="stat-row revolution-stat" style="display:none;">
                <span class="stat-label">Rotación</span>
                <span id="revolution-value" class="stat-value">0°</span>
            </div>
        </div>
        <div class="formula-section">
            <div id="formula-display"></div>
        </div>
    `
    document.body.appendChild(infoDiv)
}

/**
 * Actualizar UI con datos actuales
 */
export function updateUI(state) {
    const piValue = document.getElementById('pi-value')
    const sidesValue = document.getElementById('sides-value')
    const errorValue = document.getElementById('error-value')
    const phaseIndicator = document.querySelector('.phase-indicator')
    const formulaDisplay = document.getElementById('formula-display')
    const revolutionStat = document.querySelector('.revolution-stat')
    const revolutionValue = document.getElementById('revolution-value')

    const realPi = Math.PI
    const error = Math.abs((state.piApprox - realPi) / realPi * 100)

    piValue.textContent = state.piApprox.toFixed(6)
    sidesValue.textContent = Math.round(state.sides)

    // Formato del error
    if (error < 0.0001) {
        errorValue.textContent = '< 0.0001%'
    } else if (error < 0.01) {
        errorValue.textContent = error.toFixed(4) + '%'
    } else if (error < 1) {
        errorValue.textContent = error.toFixed(2) + '%'
    } else {
        errorValue.textContent = error.toFixed(1) + '%'
    }

    // Color del error según precisión
    if (error < 0.01) {
        errorValue.style.color = 'rgba(100, 220, 100, 0.9)'
    } else if (error < 1) {
        errorValue.style.color = 'rgba(255, 200, 100, 0.9)'
    } else {
        errorValue.style.color = 'rgba(255, 120, 120, 0.8)'
    }

    // Actualizar según fase
    if (state.phase === 1) {
        phaseIndicator.textContent = 'FASE 1 — Polígonos'
        revolutionStat.style.display = 'none'
        renderPhase1Formulas(formulaDisplay)
    } else {
        phaseIndicator.textContent = 'FASE 2 — Revolución'
        const degrees = Math.round((state.revolutionSteps / state.maxRevolutionSteps) * 360)
        revolutionStat.style.display = 'flex'
        revolutionValue.textContent = degrees + '°'
        renderPhase2Formulas(formulaDisplay)
    }
}

function renderPhase1Formulas(formulaDisplay) {
    if (window.katex) {
        formulaDisplay.innerHTML = ''
        const formulaContainer = document.createElement('div')
        formulaContainer.style.marginBottom = '8px'
        katex.render(`P = n \\cdot 2r \\cdot \\sin\\left(\\frac{\\pi}{n}\\right)`, formulaContainer, { throwOnError: false })
        formulaDisplay.appendChild(formulaContainer)

        const piFormula = document.createElement('div')
        katex.render(`\\pi \\approx \\frac{P}{2r}`, piFormula, { throwOnError: false })
        formulaDisplay.appendChild(piFormula)
    } else {
        formulaDisplay.innerHTML = `<div style="opacity: 0.5; font-size: 12px;">P = n · 2r · sin(π/n)</div>`
    }
}

function renderPhase2Formulas(formulaDisplay) {
    if (window.katex) {
        formulaDisplay.innerHTML = ''
        const areaFormula = document.createElement('div')
        areaFormula.style.marginBottom = '8px'
        katex.render(`A = 4\\pi r^2`, areaFormula, { throwOnError: false })
        formulaDisplay.appendChild(areaFormula)

        const volFormula = document.createElement('div')
        katex.render(`V = \\frac{4}{3}\\pi r^3`, volFormula, { throwOnError: false })
        formulaDisplay.appendChild(volFormula)
    } else {
        formulaDisplay.innerHTML = `<div style="opacity: 0.5; font-size: 12px;">A = 4πr² | V = (4/3)πr³</div>`
    }
}
