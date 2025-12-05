/**
 * 🥧 π — La constante que une las formas más simples con las más perfectas
 * 
 * Animación educativa que muestra:
 * - Fase 1: Polígonos de Arquímedes (3 → 4 → 8 → 16 → ...) → Círculo emerge
 * - Fase 2: Rotación del círculo sobre su eje → Esfera emerge (superficie de revolución)
 */

import * as THREE from 'three'
import './style.css'

// Config
import { getFibonacciIncrement, state } from './config/state.js'

// Core
import { cameraTargets, createScene, handleResize } from './core/scene.js'

// Geometry
import { createAxis, createCircleReference, updateCircleColors } from './geometry/circle.js'
import {
    approximatePi,
    createPolygonOutline,
    createPolygonRadials,
    updatePolygonColors
} from './geometry/polygon.js'
import { createRevolutionGroup, updateRevolutionColors } from './geometry/sphere.js'

// UI
import { createTouchControls, updatePlayButton } from './ui/controls.js'
import { createFinalText, hideFinalText, showFinalText } from './ui/final-text.js'
import { createGUI } from './ui/gui.js'
import { createInfoPanel, updateUI } from './ui/info-panel.js'
import { injectStyles } from './ui/styles.js'

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

// Inyectar estilos
injectStyles()

// Crear escena
const sceneContext = createScene()
const { scene, camera, controls, renderer, gridHelper } = sceneContext

// Crear UI
createInfoPanel()
createFinalText()
const { btnPlay, btnReset } = createTouchControls()

// ============================================================================
// OBJETOS DE LA ESCENA
// ============================================================================

let polygonOutline = null
let polygonRadials = null
let circleOutline = null
let revolutionGroup = null
let axisLine = null

let targetCameraPosition = cameraTargets.phase1.clone()

// ============================================================================
// FUNCIONES DE ACTUALIZACIÓN
// ============================================================================

function updatePolygonGeometry() {
    const sides = Math.round(state.sides)

    // Actualizar outline del polígono
    if (polygonOutline) {
        scene.remove(polygonOutline)
        polygonOutline.geometry.dispose()
    }
    polygonOutline = createPolygonOutline(sides, state.radius)
    scene.add(polygonOutline)

    // Actualizar líneas radiales
    if (polygonRadials) {
        scene.remove(polygonRadials)
        polygonRadials.traverse((child) => {
            if (child.geometry) child.geometry.dispose()
            if (child.material) child.material.dispose()
        })
    }
    polygonRadials = createPolygonRadials(sides, state.radius)
    scene.add(polygonRadials)

    // Calcular π
    state.piApprox = approximatePi(sides, state.radius)
    updateUI(state)
}

function updateCircleRef() {
    if (circleOutline) {
        scene.remove(circleOutline)
        circleOutline.geometry.dispose()
    }
    circleOutline = createCircleReference(state.radius)
    scene.add(circleOutline)
}

function updateRevolution() {
    revolutionGroup = createRevolutionGroup(state, scene, revolutionGroup)
}

// ============================================================================
// CONTROL DE FASES
// ============================================================================

function nextPhase() {
    if (state.phase === 1) {
        state.phase = 2
        state.sides = 256
        state.revolutionSteps = 0
        updatePolygonGeometry()

        // Ocultar elementos de fase 1
        if (polygonOutline) polygonOutline.visible = false
        if (polygonRadials) polygonRadials.visible = false
        if (circleOutline) circleOutline.visible = false
        gridHelper.visible = false

        // Mostrar eje
        if (!axisLine) {
            axisLine = createAxis(state.radius)
            scene.add(axisLine)
        }
        axisLine.visible = state.showAxis

        targetCameraPosition = cameraTargets.phase2.clone()
        state.revolutionSteps = 0.5
        updateRevolution()

    } else if (state.phase === 2 && state.revolutionSteps >= state.maxRevolutionSteps) {
        showFinalText()
        controls.autoRotate = true
        controls.autoRotateSpeed = 0.5
        targetCameraPosition = cameraTargets.final.clone()
    }

    updateUI(state)
}

function resetAnimation() {
    state.phase = 1
    state.sides = 4
    state.revolutionSteps = 0
    state.autoPlay = false

    // Limpiar revolución
    if (revolutionGroup) {
        scene.remove(revolutionGroup)
        revolutionGroup = null
    }

    if (axisLine) axisLine.visible = false
    gridHelper.visible = true

    if (polygonOutline) {
        polygonOutline.visible = true
        polygonOutline.rotation.y = 0
    }
    if (polygonRadials) {
        polygonRadials.visible = true
        polygonRadials.rotation.y = 0
    }
    if (circleOutline) {
        circleOutline.visible = true
        circleOutline.rotation.y = 0
        circleOutline.material.opacity = 0.4
    }

    targetCameraPosition = cameraTargets.phase1.clone()
    camera.position.copy(cameraTargets.phase1)
    controls.autoRotate = false

    hideFinalText()
    updatePolygonGeometry()
    updateCircleRef()
    updateUI(state)
}

// ============================================================================
// GUI
// ============================================================================

createGUI(state, {
    nextPhase,
    reset: resetAnimation,
    updatePolygon: updatePolygonGeometry,
    updateRadius: () => {
        updatePolygonGeometry()
        updateCircleRef()
        if (state.phase === 2) updateRevolution()
    },
    updateRevolution,
    toggleAxis: (v) => { if (axisLine) axisLine.visible = v },
    toggleGrid: (v) => { gridHelper.visible = v },
    controls
})

// ============================================================================
// INICIALIZAR GEOMETRÍA
// ============================================================================

polygonOutline = createPolygonOutline(4, state.radius)
scene.add(polygonOutline)

circleOutline = createCircleReference(state.radius)
scene.add(circleOutline)

axisLine = createAxis(state.radius)
axisLine.visible = false
scene.add(axisLine)

updatePolygonGeometry()

// ============================================================================
// LOOP DE ANIMACIÓN
// ============================================================================

const clock = new THREE.Clock()

function animate() {
    const delta = clock.getDelta()
    const elapsed = clock.getElapsedTime()

    // Interpolar cámara
    camera.position.lerp(targetCameraPosition, delta * 2)

    // Animación automática
    if (state.autoPlay) {
        if (state.phase === 1) {
            if (state.sides < 256) {
                const currentSides = Math.round(state.sides)
                const increment = currentSides <= 30 ? 3 : getFibonacciIncrement(currentSides)
                state.sides = Math.min(256, state.sides + increment * delta * state.speed * 4)
                updatePolygonGeometry()
            } else {
                nextPhase()
            }
        } else if (state.phase === 2) {
            if (state.revolutionSteps < state.maxRevolutionSteps) {
                state.revolutionSteps += delta * state.speed * 6
                state.revolutionSteps = Math.min(state.revolutionSteps, state.maxRevolutionSteps)
                updateRevolution()
                updateUI(state)
            } else {
                nextPhase()
                state.autoPlay = false
            }
        }
    }

    // Animación de "respiración" en fase 1
    if (state.phase === 1 && polygonOutline) {
        const scale = 1 + Math.sin(elapsed * 2) * 0.008
        polygonOutline.scale.setScalar(scale)
        if (polygonRadials) polygonRadials.scale.setScalar(scale)
        if (circleOutline) circleOutline.scale.setScalar(scale)

        const colorOffset = (elapsed * 0.15) % 1
        updatePolygonColors(polygonOutline, polygonRadials, colorOffset)
        updateCircleColors(circleOutline, elapsed)
    }

    // Rotación de esfera en fase 2
    if (revolutionGroup && state.phase === 2) {
        revolutionGroup.rotation.y = elapsed * 0.15
        updateRevolutionColors(revolutionGroup, elapsed)
    }

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

// ============================================================================
// EVENTOS
// ============================================================================

window.addEventListener('resize', handleResize(sceneContext))

// Controles táctiles
btnPlay.addEventListener('click', () => {
    state.autoPlay = !state.autoPlay
    updatePlayButton(btnPlay, state.autoPlay)
})

btnReset.addEventListener('click', () => {
    resetAnimation()
    updatePlayButton(btnPlay, false)
})

// Atajos de teclado
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case ' ':
            e.preventDefault()
            state.autoPlay = !state.autoPlay
            updatePlayButton(btnPlay, state.autoPlay)
            break
        case 'ArrowRight':
            nextPhase()
            break
        case 'r':
        case 'R':
            resetAnimation()
            updatePlayButton(btnPlay, false)
            break
        case 'ArrowUp':
            if (state.phase === 1) {
                state.sides = Math.min(256, state.sides * 2)
                updatePolygonGeometry()
            } else {
                state.revolutionSteps = Math.min(state.maxRevolutionSteps, state.revolutionSteps + 0.5)
                updateRevolution()
                updateUI(state)
            }
            break
        case 'ArrowDown':
            if (state.phase === 1) {
                state.sides = Math.max(3, Math.floor(state.sides / 2))
                updatePolygonGeometry()
            } else {
                state.revolutionSteps = Math.max(0, state.revolutionSteps - 0.5)
                updateRevolution()
                updateUI(state)
            }
            break
    }
})

// ============================================================================
// INICIAR
// ============================================================================

animate()

console.log(`
🥧 π Animation Controls:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPACE      → Play/Pause
→          → Siguiente Fase
↑/↓        → Más/Menos (lados o pasos)
R          → Reiniciar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fase 1: Polígono → Círculo
Fase 2: Círculo rotando → Esfera
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
