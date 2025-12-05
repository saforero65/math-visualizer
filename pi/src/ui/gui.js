import GUI from 'lil-gui'

/**
 * Crear panel de controles lil-gui
 */
export function createGUI(state, callbacks) {
    const gui = new GUI({ title: '🥧 Control de π' })

    const animFolder = gui.addFolder('Animación')
    animFolder.add(state, 'autoPlay').name('▶ Auto Play').listen()
    animFolder.add(state, 'speed', 0.1, 3, 0.1).name('Velocidad')
    animFolder.add({ nextPhase: callbacks.nextPhase }, 'nextPhase').name('→ Siguiente Fase')
    animFolder.add({ reset: callbacks.reset }, 'reset').name('↺ Reiniciar')

    const polyFolder = gui.addFolder('Polígono')
    polyFolder.add(state, 'sides', 3, 256, 1).name('Lados').onChange(callbacks.updatePolygon).listen()
    polyFolder.add(state, 'radius', 0.5, 2.5, 0.1).name('Radio').onChange(callbacks.updateRadius)

    const revFolder = gui.addFolder('Revolución')
    revFolder.add(state, 'revolutionSteps', 0, state.maxRevolutionSteps, 0.5).name('Pasos').onChange(callbacks.updateRevolution).listen()
    revFolder.add(state, 'showAxis').name('Mostrar Eje').onChange(callbacks.toggleAxis)

    const visFolder = gui.addFolder('Visual')
    visFolder.add({ showGrid: true }, 'showGrid').name('Grid').onChange(callbacks.toggleGrid)
    visFolder.add(callbacks.controls, 'autoRotate').name('Auto Rotar')

    return gui
}
