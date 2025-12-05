import * as THREE from 'three'
import { spiritualColors } from '../materials/colors.js'

/**
 * Crear un círculo en un plano rotado alrededor del eje Y
 */
export function createRevolutionCircle(angle, radius, opacity = 0.6, colorOverride = null) {
    const points = []
    const colors = []
    const segments = 64

    const progress = angle / (Math.PI * 2)
    const baseColor1 = new THREE.Color()
    const baseColor2 = new THREE.Color()

    // Degradado espiritual según progreso
    if (progress < 0.33) {
        baseColor1.set(spiritualColors.ethereal)
        baseColor2.set(spiritualColors.cosmic)
    } else if (progress < 0.66) {
        baseColor1.set(spiritualColors.cosmic)
        baseColor2.set(spiritualColors.divine)
    } else {
        baseColor1.set(spiritualColors.divine)
        baseColor2.set(spiritualColors.golden)
    }

    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2

        const x0 = Math.cos(theta) * radius
        const y0 = Math.sin(theta) * radius

        const x = x0 * Math.cos(angle)
        const y = y0
        const z = x0 * Math.sin(angle)

        points.push(new THREE.Vector3(x, y, z))

        const t = i / segments
        const color = new THREE.Color()
        if (colorOverride) {
            color.copy(colorOverride)
            color.offsetHSL(0, 0, Math.sin(t * Math.PI * 2) * 0.1)
        } else {
            color.lerpColors(baseColor1, baseColor2, Math.sin(t * Math.PI) * 0.5 + 0.5)
        }
        colors.push(color.r, color.g, color.b)
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        linewidth: 2,
        transparent: true,
        opacity: opacity
    })

    return new THREE.Line(geometry, material)
}

/**
 * Función de easing para animaciones suaves
 */
export function easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t)
}

/**
 * Actualizar colores de los círculos de revolución con animación
 */
export function updateRevolutionColors(revolutionGroup, elapsed) {
    if (!revolutionGroup) return

    const timeOffset = (elapsed * 0.2) % 1

    revolutionGroup.children.forEach((child, index) => {
        if (child.geometry && child.geometry.attributes.color) {
            const colors = child.geometry.attributes.color
            const count = colors.count

            for (let i = 0; i < count; i++) {
                const t = ((i / count) + timeOffset + index * 0.1) % 1
                const color = new THREE.Color()

                if (t < 0.33) {
                    color.lerpColors(
                        new THREE.Color(spiritualColors.ethereal),
                        new THREE.Color(spiritualColors.cosmic),
                        t * 3
                    )
                } else if (t < 0.66) {
                    color.lerpColors(
                        new THREE.Color(spiritualColors.cosmic),
                        new THREE.Color(spiritualColors.divine),
                        (t - 0.33) * 3
                    )
                } else {
                    color.lerpColors(
                        new THREE.Color(spiritualColors.divine),
                        new THREE.Color(spiritualColors.golden),
                        (t - 0.66) * 3
                    )
                }

                colors.setXYZ(i, color.r, color.g, color.b)
            }

            colors.needsUpdate = true
        }
    })
}

/**
 * Crear grupo de revolución (esfera wireframe)
 */
export function createRevolutionGroup(state, scene, existingGroup) {
    // Limpiar grupo anterior
    if (existingGroup) {
        scene.remove(existingGroup)
        existingGroup.traverse((child) => {
            if (child.geometry) child.geometry.dispose()
            if (child.material) child.material.dispose()
        })
    }

    const revolutionGroup = new THREE.Group()
    const steps = state.revolutionSteps
    const fullSteps = Math.floor(steps)
    const partialStep = steps - fullSteps

    if (steps > 0) {
        // Dibujar círculos completos
        for (let i = 0; i <= fullSteps && i <= state.maxRevolutionSteps; i++) {
            const angle = (i / state.maxRevolutionSteps) * Math.PI * 2
            let opacity = 0.5
            if (i === 0) opacity = 1.0
            else if (i === fullSteps) opacity = 0.9

            const circle = createRevolutionCircle(angle, state.radius, opacity)
            revolutionGroup.add(circle)
        }

        // Círculo parcial para suavidad
        if (partialStep > 0.05 && fullSteps < state.maxRevolutionSteps) {
            const currentAngle = (fullSteps / state.maxRevolutionSteps) * Math.PI * 2
            const nextAngle = ((fullSteps + 1) / state.maxRevolutionSteps) * Math.PI * 2
            const interpolatedAngle = currentAngle + (nextAngle - currentAngle) * easeOutQuad(partialStep)

            const partialCircle = createRevolutionCircle(
                interpolatedAngle,
                state.radius,
                partialStep * 0.7,
                new THREE.Color(0x00ffaa)
            )
            revolutionGroup.add(partialCircle)
        }

        // Meridianos
        if (fullSteps >= 1) {
            addMeridians(revolutionGroup, state, steps, fullSteps)
        }
    }

    scene.add(revolutionGroup)
    return revolutionGroup
}

/**
 * Añadir líneas meridianas a la esfera
 */
function addMeridians(revolutionGroup, state, steps, fullSteps) {
    const meridianCount = 12

    for (let m = 0; m < meridianCount; m++) {
        const theta = (m / meridianCount) * Math.PI * 2
        const meridianPoints = []
        const maxAngle = (Math.min(steps, state.maxRevolutionSteps) / state.maxRevolutionSteps) * Math.PI * 2
        const pointCount = Math.max(16, fullSteps * 2)

        for (let i = 0; i <= pointCount; i++) {
            const t = i / pointCount
            const angle = t * maxAngle

            const x0 = Math.cos(theta) * state.radius
            const y0 = Math.sin(theta) * state.radius

            const x = x0 * Math.cos(angle)
            const y = y0
            const z = x0 * Math.sin(angle)

            meridianPoints.push(new THREE.Vector3(x, y, z))
        }

        const meridianColors = []
        for (let j = 0; j < meridianPoints.length; j++) {
            const t = j / meridianPoints.length
            const color = new THREE.Color()
            color.lerpColors(
                new THREE.Color(spiritualColors.golden),
                new THREE.Color(spiritualColors.cosmic),
                t
            )
            meridianColors.push(color.r, color.g, color.b)
        }

        const meridianGeometry = new THREE.BufferGeometry().setFromPoints(meridianPoints)
        meridianGeometry.setAttribute('color', new THREE.Float32BufferAttribute(meridianColors, 3))

        const meridianMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            linewidth: 2,
            transparent: true,
            opacity: 0.3 + (steps / state.maxRevolutionSteps) * 0.25
        })

        revolutionGroup.add(new THREE.Line(meridianGeometry, meridianMaterial))
    }
}
